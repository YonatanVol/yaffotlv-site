import { db } from "@/lib/db";
import { pricingRules, seasonalRates, priceOverrides, promoCodes } from "@/lib/db/schema";
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

/** Look up a usable promo code (active, not expired, under its usage cap). */
export async function lookupPromo(code: string): Promise<{ code: string; discountPct: number } | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  const [p] = await db.select().from(promoCodes).where(eq(promoCodes.code, normalized)).limit(1);
  if (!p || !p.isActive) return null;
  if (p.expiresAt && p.expiresAt < todayJerusalem()) return null;
  if (p.maxUses != null && p.usedCount >= p.maxUses) return null;
  return { code: p.code, discountPct: p.discountPct };
}

/**
 * Server-authoritative quote for a date range — active rule, seasons, overrides,
 * and an optional promo code. `promoValid` is true only when a code was supplied
 * and is usable. Returns null only when no pricing rule is configured.
 */
export async function quoteForRange(
  checkIn: string,
  checkOut: string,
  promoCode?: string
): Promise<{ rule: ActiveRule; quote: PriceQuote; promoValid: boolean } | null> {
  const rule = await getActiveRule();
  if (!rule) return null;

  const seasons = await db.select().from(seasonalRates).where(eq(seasonalRates.isActive, true));

  const dates = dateRange(checkIn, checkOut);
  const ovRows = dates.length
    ? await db.select().from(priceOverrides).where(inArray(priceOverrides.date, dates))
    : [];
  const overrides: Record<string, number> = {};
  for (const o of ovRows) overrides[o.date] = o.price;

  const promo = promoCode && promoCode.trim() ? (await lookupPromo(promoCode)) ?? undefined : undefined;

  const quote = calculatePrice(checkIn, checkOut, rule, {
    seasons,
    overrides,
    today: todayJerusalem(),
    promo,
  });
  return { rule, quote, promoValid: !!promo };
}
