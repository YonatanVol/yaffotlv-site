/**
 * Meta and TikTok pixel bridge.
 *
 * Every call is guarded: the pixels only exist when their env vars are set, so
 * with no IDs configured this file is inert and nothing external is contacted.
 *
 * Events are mirrored from the site's own `track()` calls rather than sprinkled
 * through components — one mapping, so every existing call site lights up and
 * the two analytics systems can never drift apart.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
export const pixelsEnabled = Boolean(META_PIXEL_ID || TIKTOK_PIXEL_ID);

/**
 * Site event → the standard event each ad platform optimises against. Using
 * their standard names (rather than custom ones) is what lets the platforms
 * bid toward conversions instead of just clicks.
 */
const EVENT_MAP: Record<string, { meta: string; tiktok: string }> = {
  book_started: { meta: "InitiateCheckout", tiktok: "InitiateCheckout" },
  lead_captured: { meta: "Lead", tiktok: "SubmitForm" },
  whatsapp_clicked: { meta: "Contact", tiktok: "Contact" },
  book_completed: { meta: "Purchase", tiktok: "CompletePayment" },
};

/** Mirror one tracked event to whichever pixels are configured. */
export function mirrorToPixels(event: string, metadata?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const mapped = EVENT_MAP[event];
  if (!mapped) return; // page views are handled by the base pixel snippets

  try {
    window.fbq?.("track", mapped.meta, metadata);
    window.ttq?.track(mapped.tiktok, metadata);
  } catch {
    // A broken third-party script must never take the site down with it.
  }
}
