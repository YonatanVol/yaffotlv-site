CREATE TABLE "calendar_sync_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"status" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "calendar_sync_log_source_created_idx" ON "calendar_sync_log" USING btree ("source","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "blocked_reservation_date_unique" ON "blocked_dates" USING btree ("date") WHERE "blocked_dates"."source" = 'reservation';