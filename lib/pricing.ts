import { getDayOfWeek, dateRange, DAY_NAMES } from "./dates";

export const VAT_RATE = 0.18;

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
  rate: number; // agorot — includes proportional cleaning fee
}

export interface PriceQuote {
  checkIn: string;
  checkOut: string;
  nights: number;
  nightlyBreakdown: NightlyRate[];
  baseTotal: number;      // agorot — nightly rates only (before cleaning distribution), kept for DB compat
  cleaningFee: number;    // agorot — kept for DB compatibility
  totalBeforeVat: number; // agorot — sum of nightly rates with cleaning fee distributed
  vatAmount: number;      // agorot — totalBeforeVat * 0.18
  totalAmount: number;    // agorot — totalBeforeVat + vatAmount (total including VAT)
  currency: string;
}

/** Calculate price for a date range using pricing rules */
export function calculatePrice(
  checkIn: string,
  checkOut: string,
  rule: PricingRule
): PriceQuote {
  const nights = dateRange(checkIn, checkOut);
  const numNights = nights.length;

  // Distribute cleaning fee equally across all nights
  const cleaningPerNight = Math.round(rule.cleaningFee / numNights);
  // Handle rounding remainder: add extra agorot to the last night
  const cleaningRemainder = rule.cleaningFee - cleaningPerNight * numNights;

  const nightlyBreakdown: NightlyRate[] = nights.map((date, index) => {
    const dow = getDayOfWeek(date);
    let rate = rule.baseRateNight;
    if (dow === 4) rate = rule.thursdayRate;
    if (dow === 5) rate = rule.fridayRate;

    // Add proportional cleaning fee to each night
    const cleaningShare = index === numNights - 1
      ? cleaningPerNight + cleaningRemainder
      : cleaningPerNight;

    return { date, dayName: DAY_NAMES[dow], rate: rate + cleaningShare };
  });

  // baseTotal = original nightly sum without cleaning (for DB backward compat)
  const baseTotal = nights.reduce((sum, date) => {
    const dow = getDayOfWeek(date);
    let rate = rule.baseRateNight;
    if (dow === 4) rate = rule.thursdayRate;
    if (dow === 5) rate = rule.fridayRate;
    return sum + rate;
  }, 0);

  // totalBeforeVat = all nightly rates including distributed cleaning
  const totalBeforeVat = nightlyBreakdown.reduce((sum, n) => sum + n.rate, 0);
  const vatAmount = Math.round(totalBeforeVat * VAT_RATE);
  const totalAmount = totalBeforeVat + vatAmount;

  return {
    checkIn,
    checkOut,
    nights: numNights,
    nightlyBreakdown,
    baseTotal,
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
