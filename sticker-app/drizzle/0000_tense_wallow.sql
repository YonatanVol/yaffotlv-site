CREATE TYPE "public"."sp_pack_status" AS ENUM('draft', 'building', 'ready', 'error');--> statement-breakpoint
CREATE TYPE "public"."sp_plan" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TYPE "public"."sp_sticker_source" AS ENUM('tiktok_api', 'manual_upload');--> statement-breakpoint
CREATE TABLE "sp_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"publisher" text DEFAULT 'StickerPack' NOT NULL,
	"tray_icon_url" text,
	"download_url" text,
	"status" "sp_pack_status" DEFAULT 'draft' NOT NULL,
	"sticker_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"built_at" timestamp with time zone,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sp_stickers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pack_id" uuid,
	"source" "sp_sticker_source" NOT NULL,
	"tiktok_video_id" text,
	"original_url" text,
	"original_format" text,
	"processed_url" text NOT NULL,
	"is_animated" boolean DEFAULT false NOT NULL,
	"file_size_bytes" integer,
	"position_in_pack" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sp_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_key" text NOT NULL,
	"stickers_converted" integer DEFAULT 0 NOT NULL,
	"packs_created" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sp_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"plan" "sp_plan" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" text,
	"subscription_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sp_packs" ADD CONSTRAINT "sp_packs_user_id_sp_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sp_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_stickers" ADD CONSTRAINT "sp_stickers_user_id_sp_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sp_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_stickers" ADD CONSTRAINT "sp_stickers_pack_id_sp_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."sp_packs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_usage" ADD CONSTRAINT "sp_usage_user_id_sp_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sp_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sp_usage_user_period_idx" ON "sp_usage" USING btree ("user_id","period_key");--> statement-breakpoint
CREATE UNIQUE INDEX "sp_users_email_idx" ON "sp_users" USING btree ("email");