CREATE TYPE "public"."booking_status" AS ENUM('draft', 'pending_payment', 'confirmed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"event" text NOT NULL,
	"metadata" text,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"source" text NOT NULL,
	"external_uid" text,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'default' NOT NULL,
	"base_rate_night" integer NOT NULL,
	"thursday_rate" integer NOT NULL,
	"friday_rate" integer NOT NULL,
	"cleaning_fee" integer NOT NULL,
	"min_nights" integer DEFAULT 1 NOT NULL,
	"currency" text DEFAULT 'ILS' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "booking_status" DEFAULT 'draft' NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"nights" integer NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text NOT NULL,
	"guest_phone" text,
	"guest_count" integer DEFAULT 1,
	"base_total" integer NOT NULL,
	"cleaning_fee" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"currency" text DEFAULT 'ILS' NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "blocked_date_source_idx" ON "blocked_dates" USING btree ("date","source","external_uid");