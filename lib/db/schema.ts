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
  saturdayRate: integer("saturday_rate").notNull().default(100000), // weekend (Israel: Fri–Sat)
  cleaningFee: integer("cleaning_fee").notNull(),
  minNights: integer("min_nights").notNull().default(1),
  // Discounts (percent). The single largest applicable discount is applied.
  lastMinuteDiscountPct: integer("last_minute_discount_pct").notNull().default(10),
  lastMinuteDays: integer("last_minute_days").notNull().default(5),
  longStay7Pct: integer("long_stay_7_pct").notNull().default(10),
  longStay28Pct: integer("long_stay_28_pct").notNull().default(20),
  currency: text("currency").notNull().default("ILS"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Seasonal pricing windows — a date range that nudges the nightly rate by a percent. */
export const seasonalRates = pgTable("seasonal_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  adjustmentPct: integer("adjustment_pct").notNull(), // +25 (summer) / -10 (low season)
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Manual per-date price override (agorot) — wins over rules + seasons for that night. */
export const priceOverrides = pgTable("price_overrides", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date", { mode: "string" }).notNull().unique(),
  price: integer("price").notNull(), // agorot — accommodation price for that night
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Promo / coupon codes the owner hands out (Instagram, WhatsApp, email campaigns). */
export const promoCodes = pgTable("promo_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(), // stored UPPERCASE
  discountPct: integer("discount_pct").notNull(), // percent off accommodation
  maxUses: integer("max_uses"), // null = unlimited
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: date("expires_at", { mode: "string" }), // null = never expires
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Activity log — anonymous event tracking for analytics */
export const activityLog = pgTable(
  "activity_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id").notNull(),
    event: text("event").notNull(), // "page_view" | "book_started" | "book_completed" | "contact_opened" | "whatsapp_clicked" | "gallery_opened" | "language_changed"
    metadata: text("metadata"), // JSON string with extra data (page, locale, dates, etc.)
    /** Promoted out of `metadata` so the weekly report can aggregate in SQL. */
    path: text("path"),
    referrer: text("referrer"),
    country: text("country"),
    /* Campaign attribution. IG/TikTok in-app browsers strip the referrer, so
       these URL parameters are the only reliable signal for paid and organic
       social traffic. */
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    /** Ad click id, prefixed with its platform ("fbclid:…" / "ttclid:…"). */
    clickId: text("click_id"),
    userAgent: text("user_agent"),
    /**
     * Salted hash of the caller IP, never the address itself. Still unique per
     * visitor for counting, but not personal data we have to justify holding.
     */
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("activity_log_event_created_idx").on(table.event, table.createdAt)]
);

export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "converted", "unsubscribed"]);

/**
 * Enquiries that were started but never completed.
 *
 * A row is written as soon as a guest finishes entering their email in the
 * booking form, together with whatever they had chosen at that point, so the
 * owner can follow up on drop-offs. One row per email — later attempts update
 * the same record rather than piling up duplicates.
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /**
     * Nullable: a guest who typed only a phone number is still a lead worth
     * chasing — arguably a better one here, since enquiries run over WhatsApp.
     * Postgres allows repeated NULLs under a unique index, so phone-only rows
     * coexist with the one-row-per-email rule below.
     */
    email: text("email"),
    name: text("name"),
    phone: text("phone"),
    checkIn: date("check_in", { mode: "string" }),
    checkOut: date("check_out", { mode: "string" }),
    guests: integer("guests"),
    /** Furthest point reached: "typed_email" | "filled_details" | "submitted". */
    stage: text("stage").notNull().default("typed_email"),
    sessionId: text("session_id"),
    locale: text("locale"),
    referrer: text("referrer"),
    /** Which campaign produced this enquiry — see activity_log above. */
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    clickId: text("click_id"),
    status: leadStatusEnum("status").notNull().default("new"),
    /** Lets a follow-up email carry a working one-click unsubscribe. */
    unsubscribeToken: uuid("unsubscribe_token").defaultRandom().notNull(),
    followUpSentAt: timestamp("follow_up_sent_at", { withTimezone: true }),
    /**
     * When the owner was alerted about this lead. The hourly job claims rows
     * where this is null, so a skipped or failed run catches up next hour
     * instead of losing the lead, and a retry cannot double-send.
     */
    alertedAt: timestamp("alerted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("leads_email_unique").on(table.email),
    index("leads_status_created_idx").on(table.status, table.createdAt),
  ]
);

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

/** Where a photo appears on the site. */
export const photoSlotEnum = pgEnum("photo_slot", ["hero", "gallery", "host"]);

/**
 * Site photos managed from the admin, stored in Vercel Blob.
 *
 * `slot` decides placement: exactly one visible `hero` is used as the homepage
 * background (enforced in the action layer, not the DB, so promoting a new hero
 * is a single write). Site reads fall back to the bundled files in
 * `public/images` whenever this table is empty or unreachable, so the public
 * site can never render without photos.
 */
export const sitePhotos = pgTable(
  "site_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    /** Blob pathname — needed to delete the underlying object. */
    pathname: text("pathname").notNull(),
    /** Alt text: read by screen readers and used by search engines. */
    alt: text("alt").notNull().default(""),
    /** Short caption shown on the slider, e.g. "Living Room". */
    label: text("label"),
    slot: photoSlotEnum("slot").notNull().default("gallery"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
    width: integer("width"),
    height: integer("height"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("site_photos_slot_order_idx").on(table.slot, table.sortOrder)]
);
