/**
 * Campaign attribution — where a visitor actually came from.
 *
 * Instagram and TikTok in-app browsers routinely strip `document.referrer`, so
 * the tracking parameters on the landing URL are the only reliable signal. They
 * also only appear on the *first* page of a visit: by the time someone reaches
 * /book the query string is gone. So the first hit is captured and kept for the
 * rest of the session, and never overwritten by a later, emptier navigation.
 */

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Ad-platform click id, prefixed with its origin: "fbclid:…" / "ttclid:…". */
  clickId?: string;
}

export const ATTRIBUTION_KEY = "yaffotlv-attribution";

/** Ad platforms append these; each identifies a single ad click. */
const CLICK_IDS = ["fbclid", "ttclid", "gclid"] as const;

const clean = (v: string | null): string | undefined => {
  const s = v?.trim();
  return s ? s.slice(0, 200) : undefined;
};

/** Read campaign parameters out of a query string. */
export function parseAttribution(search: string): Attribution {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const attribution: Attribution = {
    utmSource: clean(q.get("utm_source")),
    utmMedium: clean(q.get("utm_medium")),
    utmCampaign: clean(q.get("utm_campaign")),
  };

  for (const key of CLICK_IDS) {
    const value = clean(q.get(key));
    if (value) {
      attribution.clickId = `${key}:${value}`;
      break; // one click can only come from one platform
    }
  }

  return attribution;
}

/** True when nothing useful was found — used to avoid storing empty records. */
export function isEmpty(a: Attribution): boolean {
  return !a.utmSource && !a.utmMedium && !a.utmCampaign && !a.clickId;
}

/**
 * Persist the FIRST attribution seen this session. A later page view with no
 * parameters must not erase it, or the booking that follows looks like direct
 * traffic and the campaign gets no credit.
 */
export function captureAttribution(
  search: string,
  storage: Pick<Storage, "getItem" | "setItem">
): Attribution {
  const existing = readAttribution(storage);
  if (!isEmpty(existing)) return existing;

  const found = parseAttribution(search);
  if (isEmpty(found)) return existing;

  try {
    storage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
  } catch {
    // Private mode or a full quota — attribution is never worth an exception.
  }
  return found;
}

export function readAttribution(storage: Pick<Storage, "getItem">): Attribution {
  try {
    const raw = storage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** Browser-side convenience: capture from the current URL, then return it. */
export function currentAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return captureAttribution(window.location.search, window.sessionStorage);
}
