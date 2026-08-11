import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getSiteReviews } from "./google-reviews";

const realFetch = globalThis.fetch;

/** Stand in for the Places API so the integration is testable without a key. */
function stubFetch(response: unknown, ok = true) {
  globalThis.fetch = (async () => ({
    ok,
    status: ok ? 200 : 500,
    json: async () => response,
  })) as unknown as typeof fetch;
}

function configure() {
  process.env.GOOGLE_PLACES_API_KEY = "test-key";
  process.env.GOOGLE_PLACE_ID = "test-place";
}

afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.GOOGLE_PLACE_ID;
});

test("without credentials it falls back and claims no rating", async () => {
  const r = await getSiteReviews();
  assert.equal(r.source, "fallback");
  assert.equal(r.rating, undefined, "must not invent a rating");
  assert.ok(r.reviews.length > 0, "the page still has something to show");
});

test("maps a real Places response into review cards", async () => {
  configure();
  stubFetch({
    rating: 4.8,
    userRatingCount: 17,
    reviews: [
      {
        name: "places/x/reviews/1",
        rating: 5,
        text: { text: "Lovely apartment, exactly as described." },
        authorAttribution: { displayName: "Dana" },
        publishTime: "2026-06-14T10:00:00Z",
      },
    ],
  });

  const r = await getSiteReviews();
  assert.equal(r.source, "google");
  assert.equal(r.rating, 4.8);
  assert.equal(r.total, 17);
  assert.equal(r.reviews[0].guestName, "Dana");
  assert.equal(r.reviews[0].date, "2026-06", "publish time becomes YYYY-MM");
  assert.match(r.reviews[0].text, /Lovely apartment/);
});

test("rounds the rating to one decimal, as Google displays it", async () => {
  configure();
  stubFetch({ rating: 4.6666, userRatingCount: 9, reviews: [{ text: { text: "Great" }, publishTime: "2026-01-02T00:00:00Z" }] });
  assert.equal((await getSiteReviews()).rating, 4.7);
});

test("drops empty reviews — a rating with no words is not a testimonial", async () => {
  configure();
  stubFetch({
    rating: 5,
    userRatingCount: 4,
    reviews: [{ text: { text: "   " }, publishTime: "2026-02-02T00:00:00Z" }],
  });
  const r = await getSiteReviews();
  assert.equal(r.rating, 5, "the real rating is still published");
  assert.equal(r.source, "fallback", "but the quotes fall back rather than showing blanks");
});

test("a failing Google request never breaks the page", async () => {
  configure();
  stubFetch({}, false);
  const r = await getSiteReviews();
  assert.equal(r.source, "fallback");
  assert.ok(r.reviews.length > 0);
});

test("a thrown network error never breaks the page", async () => {
  configure();
  globalThis.fetch = (async () => {
    throw new Error("network down");
  }) as unknown as typeof fetch;
  const r = await getSiteReviews();
  assert.equal(r.source, "fallback");
  assert.equal(r.rating, undefined);
});
