/**
 * YouTube Data API v3 client — read-only.
 *
 * Scope is deliberately `youtube.readonly`: the mover copies *out* of YouTube
 * and must never be able to modify or delete anything there.
 */

import { MUSIC_CATEGORY_ID, parseIsoDuration } from "./match";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://www.googleapis.com/youtube/v3";

export const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

export type OAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export type YouTubePlaylist = {
  id: string;
  title: string;
  /** Absent when YouTube does not publish a count (the Liked videos playlist). */
  itemCount?: number;
  thumbnail?: string;
};

export type YouTubeVideo = {
  id: string;
  title: string;
  channelTitle: string;
  categoryId: string;
  topicCategories: string[];
  durationSec: number;
  thumbnail?: string;
};

/** Thrown when the access token is rejected and refreshing can't fix it. */
export class ProviderAuthError extends Error {
  constructor(public provider: "google" | "spotify", message: string) {
    super(message);
    this.name = "ProviderAuthError";
  }
}

export function googleAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", YOUTUBE_SCOPE);
  url.searchParams.set("state", params.state);
  // Offline + consent so a refresh token is issued even on repeat connections;
  // without it a re-auth returns access-token-only and the tool dies in an hour.
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  return url.toString();
}

async function googleToken(body: Record<string, string>): Promise<OAuthTokens> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error_description?: string;
    error?: string;
  };
  if (!response.ok || !data.access_token) {
    throw new ProviderAuthError(
      "google",
      data.error_description || data.error || `Google token exchange failed (${response.status})`
    );
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
}

export async function exchangeGoogleCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<OAuthTokens> {
  return googleToken({
    code: params.code,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uri: params.redirectUri,
    grant_type: "authorization_code",
  });
}

export async function refreshGoogleToken(params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<OAuthTokens> {
  const tokens = await googleToken({
    refresh_token: params.refreshToken,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    grant_type: "refresh_token",
  });
  // Google usually omits the refresh token on refresh — keep the existing one.
  return { ...tokens, refreshToken: tokens.refreshToken ?? params.refreshToken };
}

async function youtubeGet<T>(
  accessToken: string,
  path: string,
  params: Record<string, string>
): Promise<T> {
  const url = new URL(`${API}/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new ProviderAuthError("google", "YouTube rejected the access token");
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: { message?: string; errors?: { reason?: string }[] };
    };
    const reason = body.error?.errors?.[0]?.reason;
    if (reason === "quotaExceeded") {
      throw new Error("YouTube API quota exhausted for today — try again tomorrow.");
    }
    throw new Error(body.error?.message || `YouTube API error (${response.status})`);
  }
  return (await response.json()) as T;
}

type Page<T> = { items?: T[]; nextPageToken?: string };

/**
 * Walks every page, up to a page cap.
 *
 * Reports `truncated` rather than silently returning a partial list: a playlist
 * longer than the cap would otherwise be copied incomplete with nothing to show
 * for it.
 */
async function paginate<T>(
  accessToken: string,
  path: string,
  params: Record<string, string>,
  maxPages = 40
): Promise<{ items: T[]; truncated: boolean }> {
  const items: T[] = [];
  let pageToken: string | undefined;
  let truncated = false;
  for (let page = 0; page < maxPages; page++) {
    const data: Page<T> = await youtubeGet(accessToken, path, {
      ...params,
      ...(pageToken ? { pageToken } : {}),
    });
    items.push(...(data.items ?? []));
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
    if (page === maxPages - 1) {
      truncated = true;
      console.warn(`[music] ${path} truncated at ${items.length} items`);
    }
  }
  return { items, truncated };
}

/** Display name for the connected account (the channel's own title). */
export async function getChannelLabel(accessToken: string): Promise<string> {
  const data = await youtubeGet<{ items?: { snippet?: { title?: string } }[] }>(
    accessToken,
    "channels",
    { part: "snippet", mine: "true" }
  );
  return data.items?.[0]?.snippet?.title ?? "YouTube account";
}

/**
 * The id of the channel's Liked videos playlist, or null.
 *
 * It is not returned by `playlists.list`, so it has to be read off the channel
 * itself. (YouTube Music's separate "Liked Music" list has no API equivalent.)
 */
export async function getLikedPlaylistId(accessToken: string): Promise<string | null> {
  const data = await youtubeGet<{
    items?: { contentDetails?: { relatedPlaylists?: { likes?: string } } }[];
  }>(accessToken, "channels", { part: "contentDetails", mine: "true" });
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.likes || null;
}

export async function listPlaylists(accessToken: string): Promise<YouTubePlaylist[]> {
  type Item = {
    id: string;
    snippet?: { title?: string; thumbnails?: Record<string, { url?: string }> };
    contentDetails?: { itemCount?: number };
  };
  const { items } = await paginate<Item>(accessToken, "playlists", {
    part: "snippet,contentDetails",
    mine: "true",
    maxResults: "50",
  });
  const playlists: YouTubePlaylist[] = items.map((item) => ({
    id: item.id,
    title: item.snippet?.title ?? "Untitled playlist",
    itemCount: item.contentDetails?.itemCount ?? 0,
    thumbnail: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url,
  }));

  // Liked videos first — it is the list most worth moving, and it never appears
  // in playlists.list. A failure here must not cost the owner the real ones.
  try {
    const likedId = await getLikedPlaylistId(accessToken);
    if (likedId && !playlists.some((playlist) => playlist.id === likedId)) {
      playlists.unshift({ id: likedId, title: "Liked videos" });
    }
  } catch (error) {
    console.warn("[music] could not read the Liked videos playlist", error);
  }

  return playlists;
}

/**
 * Video ids in playlist order. Private and deleted entries are dropped — the
 * API still lists them, but nothing can be read from them.
 */
export async function listPlaylistVideoIds(
  accessToken: string,
  playlistId: string
): Promise<{ videoIds: string[]; truncated: boolean }> {
  type Item = {
    snippet?: { title?: string };
    contentDetails?: { videoId?: string };
    status?: { privacyStatus?: string };
  };
  const { items, truncated } = await paginate<Item>(accessToken, "playlistItems", {
    part: "snippet,contentDetails,status",
    playlistId,
    maxResults: "50",
  });
  const videoIds = items
    .filter((item) => {
      // privacyStatus is the structured signal; the placeholder titles are
      // localized, so a non-English account never matches them.
      if (item.status?.privacyStatus === "private") return false;
      const title = item.snippet?.title ?? "";
      return title !== "Private video" && title !== "Deleted video";
    })
    .map((item) => item.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));
  return { videoIds, truncated };
}

/** Full details for up to 50 ids per request (the API's hard limit). */
export async function getVideos(
  accessToken: string,
  videoIds: string[]
): Promise<YouTubeVideo[]> {
  type Item = {
    id: string;
    snippet?: {
      title?: string;
      channelTitle?: string;
      categoryId?: string;
      thumbnails?: Record<string, { url?: string }>;
    };
    contentDetails?: { duration?: string };
    topicDetails?: { topicCategories?: string[] };
  };

  const videos: YouTubeVideo[] = [];
  for (let index = 0; index < videoIds.length; index += 50) {
    const chunk = videoIds.slice(index, index + 50);
    const data = await youtubeGet<{ items?: Item[] }>(accessToken, "videos", {
      part: "snippet,contentDetails,topicDetails",
      id: chunk.join(","),
    });
    for (const item of data.items ?? []) {
      videos.push({
        id: item.id,
        title: item.snippet?.title ?? "",
        channelTitle: item.snippet?.channelTitle ?? "",
        categoryId: item.snippet?.categoryId ?? "",
        topicCategories: item.topicDetails?.topicCategories ?? [],
        durationSec: parseIsoDuration(item.contentDetails?.duration),
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url,
      });
    }
  }
  return videos;
}

/**
 * "Is this actually music?" — the filter the whole tool hangs on.
 *
 * YouTube's own Music category is the strong signal. Topic metadata and
 * auto-generated "- Topic" art-track channels back it up for uploads that were
 * filed under the wrong category.
 */
export function classifyMusic(video: YouTubeVideo): { isMusic: boolean; reason: string } {
  if (video.categoryId === MUSIC_CATEGORY_ID) {
    return { isMusic: true, reason: "YouTube Music category" };
  }
  if (/-\s*Topic\s*$/i.test(video.channelTitle)) {
    return { isMusic: true, reason: "Auto-generated artist channel" };
  }
  if (video.topicCategories.some((topic) => /music|song|singing/i.test(topic))) {
    return { isMusic: true, reason: "Music topic metadata" };
  }
  return { isMusic: false, reason: "Not categorised as music" };
}
