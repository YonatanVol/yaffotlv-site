import { db } from "@/lib/db";
import { pricingRules, seasonalRates, priceOverrides } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { calculatePrice, type PriceQuote } from "@/lib/pricing";
import { dateRange, todayJerusalem } from "@/lib/dates";

/** The single active pricing rule (or null if none is configured). */
export async function getActiveRule() {
  const [rule] = await db
    .select()
    .from(pricingRules)
    .where(eq(pricingRules.isActive, true))
    .limit(1);
  return rule ?? null;
}

type ActiveRule = NonNullable<Awaited<ReturnType<typeof getActiveRule>>>;

/**
 * Server-authoritative quote for a date range — pulls the active rule, active
 * seasonal windows, and any per-date overrides, then runs calculatePrice.
 * Returns null only when no pricing rule is configured.
 */
export async function quoteForRange(
  checkIn: string,
  checkOut: string
): Promise<{ rule: ActiveRule; quote: PriceQuote } | null> {
  const rule = await getActiveRule();
  if (!rule) return null;

  const seasons = await db.select().from(seasonalRates).where(eq(seasonalRates.isActive, true));

  const dates = dateRange(checkIn, checkOut);
  const ovRows = dates.length
    ? await db.select().from(priceOverrides).where(inArray(priceOverrides.date, dates))
    : [];
  const overrides: Record<string, number> = {};
  for (const o of ovRows) overrides[o.date] = o.price;

  const quote = calculatePrice(checkIn, checkOut, rule, {
    seasons,
    overrides,
    today: todayJerusalem(),
  });
  return { rule, quote };
}
