import { getDayOfWeek, dateRange, DAY_NAMES } from "./dates";

export interface PricingRule {
  baseRateNight: number; // agorot
  thursdayRate: number;
  fridayRate: number;
  cleaningFee: number;
  minNights: number;
  currency: string;
}

export interface NightlyRate {
  date: string;
  dayName: string;
  rate: number; // agorot
}

export interface PriceQuote {
  checkIn: string;
  checkOut: string;
  nights: number;
  nightlyBreakdown: NightlyRate[];
  baseTotal: number;   // agorot
  cleaningFee: number; // agorot
  totalAmount: number; // agorot
  currency: string;
}

/** Calculate price for a date range using pricing rules */
export function calculatePrice(
  checkIn: string,
  checkOut: string,
  rule: PricingRule
): PriceQuote {
  const nights = dateRange(checkIn, checkOut);

  const nightlyBreakdown: NightlyRate[] = nights.map((date) => {
    const dow = getDayOfWeek(date);
    let rate = rule.baseRateNight;
    if (dow === 4) rate = rule.thursdayRate;
    if (dow === 5) rate = rule.fridayRate;
    return { date, dayName: DAY_NAMES[dow], rate };
  });

  const baseTotal = nightlyBreakdown.reduce((sum, n) => sum + n.rate, 0);

  return {
    checkIn,
    checkOut,
    nights: nights.length,
    nightlyBreakdown,
    baseTotal,
    cleaningFee: rule.cleaningFee,
    totalAmount: baseTotal + rule.cleaningFee,
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
