/**
 * Verified facts about the property — the single source of truth for anything
 * the site asserts.
 *
 * The rule: if it can't be checked, it doesn't belong in `PROPERTY`. Claims that
 * depend on an external account (review counts, ratings, Superhost status) live
 * in `HOST_STATS` and are `undefined` until the owner supplies the real figure
 * from their Airbnb/Booking dashboard. Components read these and simply omit the
 * badge when a value is missing, so the site is never wrong — only quieter.
 *
 * The site previously advertised "140+ reviews", a 4.71 rating (also emitted to
 * Google as structured data, which is a policy violation), "Superhost since
 * 2012" and "12 years hosting". None of it was backed by data, so it is gone
 * until it can be substantiated.
 */

/** Physically verifiable — measured, counted, or visible in the apartment. */
export const PROPERTY = {
  sizeSqm: 80,
  rooms: 3,
  bedrooms: 2,
  beds: 5,
  bathrooms: 1.5,
  maxGuests: 8,
  renovatedYear: 2024,
  /** Walking minutes to the beach. */
  beachWalkMinutes: 10,
  checkInFrom: "15:00",
  checkOutBy: "11:00",
  street: "Baruch Karo 24",
  city: "Jaffa, Tel Aviv",
} as const;

/**
 * Claims that require evidence from an external platform.
 *
 * Fill these in from the real dashboard and every badge across the site returns
 * automatically — no other file needs to change. Leave `undefined` to hide.
 */
export const HOST_STATS: {
  reviewCount?: number;
  rating?: number;
  isSuperhost?: boolean;
  /** Calendar year hosting began, e.g. 2019. */
  hostingSince?: number;
} = {
  // reviewCount: undefined,
  // rating: undefined,
  // isSuperhost: undefined,
  // hostingSince: undefined,
};

/** True only when there is a real rating AND real reviews behind it. */
export function hasVerifiedRating(): boolean {
  return typeof HOST_STATS.rating === "number" && (HOST_STATS.reviewCount ?? 0) > 0;
}

/** Years hosted, when the start year is known. */
export function yearsHosting(now = new Date()): number | undefined {
  if (!HOST_STATS.hostingSince) return undefined;
  return Math.max(0, now.getFullYear() - HOST_STATS.hostingSince);
}
