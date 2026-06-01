import { createHash } from "node:crypto";

// IMPORTANT: TikTok provides NO official API for comment stickers. This module
// makes a best-effort request to TikTok's public web endpoint. TikTok actively
// changes and protects these endpoints, so extraction may fail at any time — in
// that case we return a structured failure and the UI falls back to manual
// upload. We only ever read PUBLIC content and never attempt to bypass logins,
// CAPTCHAs, or anti-bot protections.

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type FailureReason =
  | "invalid_url"
  | "unresolved_short_link"
  | "blocked"
  | "no_stickers"
  | "network_error";

export interface RawSticker {
  url: string;
  buffer: Buffer;
  format: string; // "webp" | "gif" | "png" | "jpeg" | "unknown"
  contentHash: string;
}

export interface ExtractResult {
  ok: boolean;
  videoId?: string;
  stickers: RawSticker[];
  reason?: FailureReason;
  message?: string;
}

/** Extract the canonical numeric video ID from a standard TikTok video URL. */
export function parseVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d{6,})/);
  if (match) return match[1];
  // Bare numeric id
  const bare = url.trim().match(/^(\d{6,})$/);
  return bare ? bare[1] : null;
}

function isShortLink(url: string): boolean {
  return /https?:\/\/(vm|vt|www)\.tiktok\.com\/(t\/)?[A-Za-z0-9]+\/?$/.test(url) &&
    !url.includes("/video/");
}

/** Resolve a vm.tiktok.com short link to its canonical URL with one HEAD request. */
async function resolveShortLink(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT },
    });
    return res.url || null;
  } catch {
    return null;
  }
}

function detectFormat(contentType: string | null, bytes: Buffer): string {
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("jpeg")) return "jpeg";
  // Sniff magic numbers as a fallback
  if (bytes.subarray(0, 3).toString("hex") === "474946") return "gif";
  if (bytes.subarray(0, 4).toString("hex") === "89504e47") return "png";
  if (bytes.subarray(8, 12).toString() === "WEBP") return "webp";
  if (bytes.subarray(0, 2).toString("hex") === "ffd8") return "jpeg";
  return "unknown";
}

/** Pull sticker CDN URLs out of a TikTok comment-list JSON payload. */
function extractStickerUrls(data: unknown): string[] {
  const urls = new Set<string>();
  const comments = (data as { comments?: unknown[] })?.comments;
  if (!Array.isArray(comments)) return [];

  for (const comment of comments) {
    const stickers = (comment as { sticker_info?: { stickers?: unknown[] } })
      ?.sticker_info?.stickers;
    if (!Array.isArray(stickers)) continue;
    for (const sticker of stickers) {
      const list =
        (sticker as { static_url?: { url_list?: string[] } })?.static_url
          ?.url_list ??
        (sticker as { animated_url?: { url_list?: string[] } })?.animated_url
          ?.url_list ??
        (sticker as { url_list?: string[] })?.url_list;
      if (Array.isArray(list) && list.length > 0) urls.add(list[0]);
    }
  }
  return [...urls];
}

async function downloadSticker(url: string): Promise<RawSticker | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Referer: "https://www.tiktok.com/" },
    });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) return null;
    return {
      url,
      buffer,
      format: detectFormat(res.headers.get("content-type"), buffer),
      contentHash: createHash("sha256").update(buffer).digest("hex"),
    };
  } catch {
    return null;
  }
}

/**
 * Attempt to extract sticker replies from a public TikTok video's comments.
 * Always resolves; check `.ok` and `.reason`.
 */
export async function extractStickersFromUrl(
  inputUrl: string
): Promise<ExtractResult> {
  let url = inputUrl.trim();

  if (isShortLink(url)) {
    const resolved = await resolveShortLink(url);
    if (!resolved) {
      return {
        ok: false,
        stickers: [],
        reason: "unresolved_short_link",
        message: "Could not resolve the short link. Paste the full video URL.",
      };
    }
    url = resolved;
  }

  const videoId = parseVideoId(url);
  if (!videoId) {
    return {
      ok: false,
      stickers: [],
      reason: "invalid_url",
      message: "That doesn't look like a TikTok video URL.",
    };
  }

  const endpoint =
    `https://www.tiktok.com/api/comment/list/?aweme_id=${videoId}` +
    `&count=50&cursor=0&aid=1988`;

  let data: unknown;
  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: `https://www.tiktok.com/`,
        Accept: "application/json, text/plain, */*",
      },
    });
    if (!res.ok) {
      return {
        ok: false,
        videoId,
        stickers: [],
        reason: "blocked",
        message:
          "TikTok declined the request. Use manual upload to add your stickers.",
      };
    }
    const text = await res.text();
    if (!text) {
      return {
        ok: false,
        videoId,
        stickers: [],
        reason: "blocked",
        message:
          "TikTok returned an empty response. Use manual upload instead.",
      };
    }
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      videoId,
      stickers: [],
      reason: "network_error",
      message: "Could not reach TikTok. Try again or use manual upload.",
    };
  }

  const stickerUrls = extractStickerUrls(data);
  if (stickerUrls.length === 0) {
    return {
      ok: false,
      videoId,
      stickers: [],
      reason: "no_stickers",
      message:
        "No sticker replies found on this video. Use manual upload to add stickers.",
    };
  }

  const downloaded = await Promise.all(stickerUrls.map(downloadSticker));
  const seen = new Set<string>();
  const stickers: RawSticker[] = [];
  for (const s of downloaded) {
    if (s && !seen.has(s.contentHash)) {
      seen.add(s.contentHash);
      stickers.push(s);
    }
  }

  if (stickers.length === 0) {
    return {
      ok: false,
      videoId,
      stickers: [],
      reason: "no_stickers",
      message: "Stickers were found but could not be downloaded.",
    };
  }

  return { ok: true, videoId, stickers };
}
