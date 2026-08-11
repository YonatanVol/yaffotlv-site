import { reviews as fallbackReviews, type Review } from "@/lib/reviews-data";

/**
 * Real guest reviews from the Google Business Profile.
 *
 * Google reviews are public, verifiable and *meant* to be displayed, which is
 * what makes them the honest replacement for the placeholder reviews — and the
 * only basis on which we can legitimately publish an `aggregateRating` to
 * Google again (see components/structured-data.tsx).
 *
 * Configure with GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID. Without them this
 * returns the bundled fallback and the site behaves exactly as before, so the
 * feature ships dark.
 *
 * KNOWN LIMIT: the Places API returns at most 5 reviews and cannot paginate.
 * The rating and total review count are the full, real figures — only the
 * displayed quotes are capped. Showing every review needs the Business Profile
 * API, which requires OAuth and ownership verification.
 */

export interface SiteReviews {
  /** Average rating, when a real one is available. */
  rating?: number;
  /** Total number of reviews behind that rating. */
  total?: number;
  reviews: Review[];
  source: "google" | "fallback";
}

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

interface GooglePlaceReview {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
  publishTime?: string;
}

interface GooglePlaceResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlaceReview[];
}

/** Google gives an ISO timestamp; the cards want "YYYY-MM". */
function toMonth(publishTime?: string): string {
  if (!publishTime) return "";
  return publishTime.slice(0, 7);
}

function toReview(r: GooglePlaceReview, index: number): Review {
  return {
    id: r.name ?? `google-${index}`,
    guestName: r.authorAttribution?.displayName ?? "Google guest",
    // Google exposes no country for reviewers; the flag column stays empty
    // rather than inventing one.
    country: "",
    countryFlag: "",
    date: toMonth(r.publishTime),
    rating: r.rating ?? 5,
    // The card type predates this; Google reviews are labelled at render time.
    source: "airbnb",
    text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
  };
}

/**
 * Fetch reviews for the site. Cached for a day: reviews change slowly, and an
 * API call per page view would be both slow and needlessly billable.
 */
export async function getSiteReviews(): Promise<SiteReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return { reviews: fallbackReviews, source: "fallback" };
  }

  try {
    const res = await fetch(`${PLACES_ENDPOINT}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        // Ask only for what we render — field masks are how Places bills.
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("Google Places request failed:", res.status);
      return { reviews: fallbackReviews, source: "fallback" };
    }

    const data = (await res.json()) as GooglePlaceResponse;
    const mapped = (data.reviews ?? [])
      .map(toReview)
      .filter((r) => r.text.length > 0);

    // A place with a rating but no written reviews still gives us the honest
    // aggregate; fall back only for the quotes.
    if (!data.rating || !data.userRatingCount) {
      return { reviews: mapped.length ? mapped : fallbackReviews, source: mapped.length ? "google" : "fallback" };
    }

    return {
      rating: Math.round(data.rating * 10) / 10,
      total: data.userRatingCount,
      reviews: mapped.length ? mapped : fallbackReviews,
      source: mapped.length ? "google" : "fallback",
    };
  } catch (error) {
    // Never let a third-party outage take the page down.
    console.error("Google Places error:", error);
    return { reviews: fallbackReviews, source: "fallback" };
  }
}
