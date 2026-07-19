CREATE TYPE "public"."photo_slot" AS ENUM('hero', 'gallery', 'host');--> statement-breakpoint
CREATE TABLE "site_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"label" text,
	"slot" "photo_slot" DEFAULT 'gallery' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "site_photos_slot_order_idx" ON "site_photos" USING btree ("slot","sort_order");