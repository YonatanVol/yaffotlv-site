import {
  pgTable,
  text,
  integer,
  timestamp,
  date,
  boolean,
  uuid,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const bookingStatusEnum = pgEnum("booking_status", [
  "draft",
  "pending_payment",
  "confirmed",
  "cancelled",
  "expired",
]);

/** Dates blocked by external calendars (Airbnb, Booking.com), manual blocks, or active reservations */
export const blockedDates = pgTable(
  "blocked_dates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    source: text("source").notNull(), // "airbnb" | "booking_com" | "manual" | "reservation"
    externalUid: text("external_uid"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("blocked_date_source_idx").on(table.date, table.source, table.externalUid),
    // Atomic double-booking guard: at most ONE direct-reservation hold per date.
    // (External airbnb/booking/manual blocks may still coexist on the same date.)
    uniqueIndex("blocked_reservation_date_unique")
      .on(table.date)
      .where(sql`${table.source} = 'reservation'`),
  ]
);

/** Reservations from direct bookings */
export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: bookingStatusEnum("status").notNull().default("draft"),
  checkIn: date("check_in", { mode: "string" }).notNull(),
  checkOut: date("check_out", { mode: "string" }).notNull(),
  nights: integer("nights").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  guestCount: integer("guest_count").default(1),
  // Pricing snapshot (agorot = ILS cents)
  baseTotal: integer("base_total").notNull(),
  cleaningFee: integer("cleaning_fee").notNull(),
  totalAmount: integer("total_amount").notNull(),
  currency: text("currency").notNull().default("ILS"),
  // Stripe
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

/** Pricing rules — editable from admin */
export const pricingRules = pgTable("pricing_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().default("default"),
  baseRateNight: integer("base_rate_night").notNull(), // agorot (55000 = 550 ILS)
  thursdayRate: integer("thursday_rate").notNull(),
  fridayRate: integer("friday_rate").notNull(),
  cleaningFee: integer("cleaning_fee").notNull(),
  minNights: integer("min_nights").notNull().default(1),
  currency: text("currency").notNull().default("ILS"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Activity log — anonymous event tracking for analytics */
export const activityLog = pgTable("activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  event: text("event").notNull(), // "page_view" | "book_started" | "book_completed" | "contact_opened" | "whatsapp_clicked" | "gallery_opened" | "language_changed"
  metadata: text("metadata"), // JSON string with extra data (page, locale, dates, etc.)
  userAgent: text("user_agent"),
  ip: text("ip"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Admin login attempts — per-IP rate limiting / temporary lockout */
export const adminLoginAttempts = pgTable(
  "admin_login_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ip: text("ip").notNull(),
    success: boolean("success").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("admin_login_attempts_ip_created_idx").on(table.ip, table.createdAt)]
);

/** Processed payment-provider webhook events — idempotency / replay guard.
 *  Provider-agnostic so future rails (e.g. a local Israeli סליקה provider) reuse it. */
export const processedWebhookEvents = pgTable("processed_webhook_events", {
  eventId: text("event_id").primaryKey(),
  provider: text("provider").notNull(), // "stripe" | future providers
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Calendar sync runs — per-source result/count/timestamp. Feeds the admin sync-status panel. */
export const calendarSyncLog = pgTable(
  "calendar_sync_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    source: text("source").notNull(), // "airbnb" | "booking_com"
    status: text("status").notNull(), // "success" | "error"
    count: integer("count").notNull().default(0),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("calendar_sync_log_source_created_idx").on(table.source, table.createdAt)]
);
