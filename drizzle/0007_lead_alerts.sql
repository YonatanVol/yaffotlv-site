ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "alerted_at" timestamp with time zone;