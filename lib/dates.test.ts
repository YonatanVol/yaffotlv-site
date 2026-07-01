import { test } from "node:test";
import assert from "node:assert/strict";
import { isRangeAvailable } from "./dates";

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
