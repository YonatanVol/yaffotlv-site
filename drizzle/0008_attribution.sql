ALTER TABLE "activity_log" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "utm_medium" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "activity_log" ADD COLUMN "click_id" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_medium" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "click_id" text;