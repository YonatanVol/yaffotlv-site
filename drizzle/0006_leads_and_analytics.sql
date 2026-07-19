CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'converted', 'unsubscribed');--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"check_in" date,
	"check_out" date,
	"guests" integer,
	"stage" text DEFAULT 'typed_email' NOT NULL,
	"session_id" text,
	"locale" text,
	"referrer" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"unsubscribe_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"follow_up_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "path" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "referrer" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "country" text;--> statement-breakpoint
CREATE UNIQUE INDEX "leads_email_unique" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_status_created_idx" ON "leads" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "activity_log_event_created_idx" ON "activity_log" USING btree ("event","created_at");