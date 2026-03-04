import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pricingRules } from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding pricing rules...");

  await db.insert(pricingRules).values({
    name: "default",
    baseRateNight: 55000,  // 550 ILS
    thursdayRate: 100000,  // 1000 ILS
    fridayRate: 100000,    // 1000 ILS
    cleaningFee: 30000,    // 300 ILS
    minNights: 1,
    currency: "ILS",
    isActive: true,
  });

  console.log("Seed complete.");
}

seed().catch(console.error);
