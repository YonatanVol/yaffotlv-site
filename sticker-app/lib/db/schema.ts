import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// All tables are prefixed `sp_` because this app shares the same Neon database
// as the root yaffotlv-site rental app. drizzle.config.ts scopes migrations to
// `sp_*` so the rental tables are never affected.

export const planEnum = pgEnum("sp_plan", ["free", "pro"]);

export const packStatusEnum = pgEnum("sp_pack_status", [
  "draft",
  "building",
  "ready",
  "error",
]);

export const stickerSourceEnum = pgEnum("sp_sticker_source", [
  "tiktok_api",
  "manual_upload",
]);

/** Application users (email/password auth). */
export const spUsers = pgTable(
  "sp_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name"),
    plan: planEnum("plan").notNull().default("free"),
    // Stripe references
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    subscriptionStatus: text("subscription_status"), // active | past_due | canceled
    subscriptionPeriodEnd: timestamp("subscription_period_end", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("sp_users_email_idx").on(table.email)]
);

/** Per-user, per-month usage counters. */
export const spUsage = pgTable(
  "sp_usage",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => spUsers.id, { onDelete: "cascade" }),
    periodKey: text("period_key").notNull(), // e.g. "2026-05"
    stickersConverted: integer("stickers_converted").notNull().default(0),
    packsCreated: integer("packs_created").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("sp_usage_user_period_idx").on(table.userId, table.periodKey),
  ]
);

/** WhatsApp sticker packs. */
export const spPacks = pgTable("sp_packs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => spUsers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  publisher: text("publisher").notNull().default("StickerPack"),
  trayIconUrl: text("tray_icon_url"),
  downloadUrl: text("download_url"),
  status: packStatusEnum("status").notNull().default("draft"),
  stickerCount: integer("sticker_count").notNull().default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  builtAt: timestamp("built_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

/** Individual converted stickers. */
export const spStickers = pgTable("sp_stickers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => spUsers.id, { onDelete: "cascade" }),
  packId: uuid("pack_id").references(() => spPacks.id, {
    onDelete: "set null",
  }),
  source: stickerSourceEnum("source").notNull(),
  tiktokVideoId: text("tiktok_video_id"),
  originalUrl: text("original_url"),
  originalFormat: text("original_format"),
  processedUrl: text("processed_url").notNull(),
  isAnimated: boolean("is_animated").notNull().default(false),
  fileSizeBytes: integer("file_size_bytes"),
  positionInPack: integer("position_in_pack"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type SpUser = typeof spUsers.$inferSelect;
export type SpPack = typeof spPacks.$inferSelect;
export type SpSticker = typeof spStickers.$inferSelect;
