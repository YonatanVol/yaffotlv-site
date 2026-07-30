import { test } from "node:test";
import assert from "node:assert/strict";
import { isRangeAvailable, firstAvailableMonth } from "./dates";

/** Every night of a month, for building "sold out" fixtures. */
function fullMonth(year: number, month: number): string[] {
  const days = new Date(year, month, 0).getDate();
  return Array.from(
    { length: days },
    (_, i) => `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
  );
}

test("firstAvailableMonth skips a sold-out month and lands on the next open one", () => {
  // The real production case: August fully booked, September wide open.
  const blocked = new Set(fullMonth(2026, 8));
  assert.equal(firstAvailableMonth(blocked, "2026-08-01"), "2026-09-01");
});

test("firstAvailableMonth stays on the current month when it still has a free night", () => {
  const blocked = new Set(fullMonth(2026, 8).filter((d) => d !== "2026-08-24"));
  assert.equal(firstAvailableMonth(blocked, "2026-08-01"), "2026-08-01");
});

test("firstAvailableMonth ignores free nights that are already in the past", () => {
  // Aug 1–9 are free but behind us; the first *bookable* night is Aug 20.
  const blocked = new Set(fullMonth(2026, 8).filter((d) => d >= "2026-08-10" && d < "2026-08-20"));
  assert.equal(firstAvailableMonth(blocked, "2026-08-15"), "2026-08-01");
});

test("firstAvailableMonth returns null when everything in range is booked", () => {
  const blocked = new Set([...fullMonth(2026, 8), ...fullMonth(2026, 9)]);
  assert.equal(firstAvailableMonth(blocked, "2026-08-01", 2), null);
});

test("a 1-night stay may check out the morning another guest arrives (same-day turnover)", () => {
  const blocked = new Set(["2026-07-03"]); // next guest checks in July 3
  // Direct guest occupies only the night of July 2; July 3 is just the checkout day.
  assert.equal(isRangeAvailable("2026-07-02", "2026-07-03", blocked), true);
});

test("a range that occupies a booked night is unavailable", () => {
  const blocked = new Set(["2026-07-03"]);
  // July 2 -> July 5 occupies nights July 2, 3, 4 — July 3 is booked.
  assert.equal(isRangeAvailable("2026-07-02", "2026-07-05", blocked), false);
});

test("checking in on a booked night is unavailable", () => {
  const blocked = new Set(["2026-07-02"]);
  assert.equal(isRangeAvailable("2026-07-02", "2026-07-04", blocked), false);
});

test("zero nights is never available", () => {
  assert.equal(isRangeAvailable("2026-07-02", "2026-07-02", new Set()), false);
});

test("a fully free range is available", () => {
  assert.equal(isRangeAvailable("2026-07-10", "2026-07-13", new Set(["2026-08-01"])), true);
});
