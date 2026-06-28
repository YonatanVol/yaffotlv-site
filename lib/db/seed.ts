import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pricingRules, seasonalRates } from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding pricing rules...");

  await db.insert(pricingRules).values({
    name: "default",
    baseRateNight: 55000,  // 550 ILS
    thursdayRate: 100000,  // 1000 ILS
    fridayRate: 100000,    // 1000 ILS
    saturdayRate: 100000,  // 1000 ILS (Israeli weekend)
    cleaningFee: 30000,    // 300 ILS
    minNights: 1,
    lastMinuteDiscountPct: 10,
    lastMinuteDays: 5,
    longStay7Pct: 10,
    longStay28Pct: 20,
    currency: "ILS",
    isActive: true,
  });

  await db.insert(seasonalRates).values([
    { name: "Summer", startDate: "2026-06-15", endDate: "2026-09-15", adjustmentPct: 25, isActive: true },
    { name: "Winter (low season)", startDate: "2026-11-01", endDate: "2027-02-28", adjustmentPct: -10, isActive: true },
  ]);

  console.log("Seed complete.");
}

seed().catch(console.error);
