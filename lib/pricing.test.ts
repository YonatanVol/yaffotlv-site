import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePrice, type PricingRule, type SeasonalRate } from "./pricing";

const rule: PricingRule = {
  baseRateNight: 55000,
  thursdayRate: 100000,
  fridayRate: 100000,
  saturdayRate: 100000,
  cleaningFee: 30000,
  minNights: 1,
  lastMinuteDiscountPct: 10,
  lastMinuteDays: 5,
  longStay7Pct: 10,
  longStay28Pct: 20,
  currency: "ILS",
};

test("two base nights: accommodation + cleaning + 18% VAT", () => {
  const q = calculatePrice("2026-11-22", "2026-11-24", rule, { today: "2026-06-01" });
  assert.equal(q.nights, 2);
  assert.equal(q.baseTotal, 110000); // 550 + 550
  assert.equal(q.discountAmount, 0);
  assert.equal(q.totalBeforeVat, 140000); // + 300 cleaning
  assert.equal(q.vatAmount, 25200);
  assert.equal(q.totalAmount, 165200);
});

test("Saturday is charged at the weekend rate", () => {
  const q = calculatePrice("2026-11-27", "2026-11-29", rule, { today: "2026-06-01" }); // Fri + Sat
  assert.equal(q.baseTotal, 200000); // 1000 + 1000
});

test("a +25% season rounds nightly rates to whole shekels", () => {
  const seasons: SeasonalRate[] = [
    { name: "Summer", startDate: "2026-07-01", endDate: "2026-08-31", adjustmentPct: 25, isActive: true },
  ];
  const q = calculatePrice("2026-07-06", "2026-07-08", rule, { seasons, today: "2026-06-01" });
  assert.equal(q.nightlyBreakdown[0].rate, 68800); // 550 * 1.25 = 687.5 -> 688
  assert.equal(q.baseTotal, 137600);
});

test("7+ nights gets the long-stay discount", () => {
  const q = calculatePrice("2026-11-22", "2026-11-29", rule, { today: "2026-06-01" });
  assert.equal(q.nights, 7);
  assert.equal(q.discountPct, 10);
  assert.ok(q.discountAmount > 0);
});

test("a per-date override wins for that night", () => {
  const q = calculatePrice("2026-11-22", "2026-11-24", rule, {
    overrides: { "2026-11-22": 40000 },
    today: "2026-06-01",
  });
  assert.equal(q.nightlyBreakdown[0].rate, 40000);
  assert.equal(q.nightlyBreakdown[0].override, true);
});

test("last-minute discount applies inside the window", () => {
  const q = calculatePrice("2026-11-22", "2026-11-24", rule, { today: "2026-11-20" });
  assert.equal(q.discountPct, 10);
  assert.match(q.discountLabel ?? "", /last-minute/i);
});

test("a bigger promo code replaces the automatic discount", () => {
  const q = calculatePrice("2026-11-22", "2026-11-24", rule, {
    today: "2026-11-20",
    promo: { code: "SAVE20", discountPct: 20 },
  });
  assert.equal(q.discountPct, 20);
  assert.match(q.discountLabel ?? "", /SAVE20/);
});
