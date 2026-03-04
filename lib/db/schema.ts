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
} from "drizzle-orm/pg-core";

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
  (table) => [uniqueIndex("blocked_date_source_idx").on(table.date, table.source, table.externalUid)]
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
