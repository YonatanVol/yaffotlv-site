CREATE TABLE "price_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "price_overrides_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "seasonal_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"adjustment_pct" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "saturday_rate" integer DEFAULT 100000 NOT NULL;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "last_minute_discount_pct" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "last_minute_days" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "long_stay_7_pct" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "long_stay_28_pct" integer DEFAULT 20 NOT NULL;