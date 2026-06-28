import { getDayOfWeek, dateRange, countNights, DAY_NAMES } from "./dates";

export const VAT_RATE = 0.18;

export interface PricingRule {
  baseRateNight: number; // agorot
  thursdayRate: number;
  fridayRate: number;
  saturdayRate: number;
  cleaningFee: number;
  minNights: number;
  lastMinuteDiscountPct: number;
  lastMinuteDays: number;
  longStay7Pct: number;
  longStay28Pct: number;
  currency: string;
}

export interface SeasonalRate {
  name: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD" inclusive
  adjustmentPct: number; // +25 / -10
  isActive: boolean;
}

export interface NightlyRate {
  date: string;
  dayName: string;
  rate: number; // agorot — accommodation only (after season/override), before discount + cleaning
  override?: boolean;
  season?: string;
}

export interface PriceQuote {
  checkIn: string;
  checkOut: string;
  nights: number;
  nightlyBreakdown: NightlyRate[];
  baseTotal: number; // agorot — accommodation subtotal BEFORE discount (kept for DB compat)
  discountPct: number; // 0 when none
  discountAmount: number; // agorot
  discountLabel: string | null;
  cleaningFee: number; // agorot
  totalBeforeVat: number; // agorot — (accommodation − discount) + cleaning
  vatAmount: number; // agorot
  totalAmount: number; // agorot — total incl. VAT (the amount charged)
  currency: string;
}

interface CalcOptions {
  seasons?: SeasonalRate[];
  overrides?: Record<string, number>; // date -> agorot
  today?: string; // "YYYY-MM-DD" — for the last-minute discount
  promo?: { code: string; discountPct: number }; // an applied promo code
}

function baseRateForDow(rule: PricingRule, dow: number): number {
  if (dow === 4) return rule.thursdayRate; // Thu
  if (dow === 5) return rule.fridayRate; // Fri
  if (dow === 6) return rule.saturdayRate; // Sat
  return rule.baseRateNight; // Sun–Wed
}

/** Largest seasonal adjustment that covers `date` (0 when none apply). */
function seasonForDate(seasons: SeasonalRate[], date: string): SeasonalRate | null {
  const applicable = seasons.filter((s) => s.isActive && date >= s.startDate && date <= s.endDate);
  if (applicable.length === 0) return null;
  return applicable.reduce((a, b) => (b.adjustmentPct > a.adjustmentPct ? b : a));
}

/** Calculate the price for a date range from the rules, seasons, overrides and discounts. */
export function calculatePrice(
  checkIn: string,
  checkOut: string,
  rule: PricingRule,
  opts: CalcOptions = {}
): PriceQuote {
  const { seasons = [], overrides = {}, today } = opts;
  const nights = dateRange(checkIn, checkOut);
  const numNights = nights.length;

  const nightlyBreakdown: NightlyRate[] = nights.map((date) => {
    const dow = getDayOfWeek(date);
    const override = overrides[date];
    if (override != null) {
      return { date, dayName: DAY_NAMES[dow], rate: override, override: true };
    }
    const season = seasonForDate(seasons, date);
    const base = baseRateForDow(rule, dow);
    // Round season-adjusted rates to whole shekels (no half-shekel nightly prices).
    const rate = season
      ? Math.round((base * (1 + season.adjustmentPct / 100)) / 100) * 100
      : base;
    return { date, dayName: DAY_NAMES[dow], rate, season: season?.name };
  });

  const baseTotal = nightlyBreakdown.reduce((sum, n) => sum + n.rate, 0);

  // --- Discount: apply the single largest applicable discount ---
  const longStayPct = numNights >= 28 ? rule.longStay28Pct : numNights >= 7 ? rule.longStay7Pct : 0;
  let lastMinutePct = 0;
  if (today) {
    const daysUntil = countNights(today, checkIn);
    if (daysUntil >= 0 && daysUntil <= rule.lastMinuteDays) lastMinutePct = rule.lastMinuteDiscountPct;
  }
  const promoPct = opts.promo?.discountPct ?? 0;

  // Apply the single best discount — promo, long-stay, or last-minute (no stacking).
  let discountPct = 0;
  let discountLabel: string | null = null;
  if (promoPct > 0 && promoPct >= longStayPct && promoPct >= lastMinutePct) {
    discountPct = promoPct;
    discountLabel = `Promo code ${opts.promo!.code}`;
  } else if (longStayPct > 0 && longStayPct >= lastMinutePct) {
    discountPct = longStayPct;
    discountLabel = numNights >= 28 ? "Long-stay discount (28+ nights)" : "Long-stay discount (7+ nights)";
  } else if (lastMinutePct > 0) {
    discountPct = lastMinutePct;
    discountLabel = "Last-minute discount";
  }
  const discountAmount = Math.round((baseTotal * discountPct) / 100);

  const totalBeforeVat = baseTotal - discountAmount + rule.cleaningFee;
  const vatAmount = Math.round(totalBeforeVat * VAT_RATE);
  const totalAmount = totalBeforeVat + vatAmount;

  return {
    checkIn,
    checkOut,
    nights: numNights,
    nightlyBreakdown,
    baseTotal,
    discountPct,
    discountAmount,
    discountLabel,
    cleaningFee: rule.cleaningFee,
    totalBeforeVat,
    vatAmount,
    totalAmount,
    currency: rule.currency,
  };
}

/** Format agorot as ILS display: "1,550" */
export function formatILS(agorot: number): string {
  return Math.round(agorot / 100).toLocaleString("en-IL");
}

/** Format agorot with currency symbol: "1,550 ILS" */
export function formatPrice(agorot: number, currency = "ILS"): string {
  return `${formatILS(agorot)} ${currency}`;
}
