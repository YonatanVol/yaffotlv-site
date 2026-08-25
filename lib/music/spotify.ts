/**
 * Spotify Web API client.
 *
 * Scopes are limited to reading the owner's own playlists and writing tracks
 * into them: nothing here can touch playback, library, or follows.
 */

import type { SpotifyCandidate } from "./match";
import { ProviderAuthError, type OAuthTokens } from "./youtube";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export const SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ");

export type SpotifyAccount = { id: string; label: string };

export type SpotifyPlaylist = {
  id: string;
  name: string;
  trackCount: number;
  isPublic: boolean;
  url?: string;
};

export function spotifyAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", SPOTIFY_SCOPES);
  url.searchParams.set("state", params.state);
  return url.toString();
}

async function spotifyToken(
  body: Record<string, string>,
  clientId: string,
  clientSecret: string
): Promise<OAuthTokens> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
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
      "spotify",
      data.error_description || data.error || `Spotify token exchange failed (${response.status})`
    );
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
}

export async function exchangeSpotifyCode(params: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<OAuthTokens> {
  return spotifyToken(
    {
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirectUri,
    },
    params.clientId,
    params.clientSecret
  );
}

export async function refreshSpotifyToken(params: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<OAuthTokens> {
  const tokens = await spotifyToken(
    { grant_type: "refresh_token", refresh_token: params.refreshToken },
    params.clientId,
    params.clientSecret
  );
  return { ...tokens, refreshToken: tokens.refreshToken ?? params.refreshToken };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Spotify throttles hard on bursts of searches and answers 429 with a
 * `Retry-After`. Honour it (a few times) instead of failing the whole transfer.
 */
async function spotifyFetch<T>(
  accessToken: string,
  path: string,
  init: RequestInit = {},
  attempt = 0
): Promise<T> {
  const response = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 429 && attempt < 3) {
    // Retry-After may be an HTTP date or absent, both of which parse to NaN.
    // Math.min(NaN, 20) is NaN and wait(NaN) resolves on the next tick, which
    // would fire three instant retries at an endpoint that is already throttling.
    const parsed = Number(response.headers.get("Retry-After"));
    const retryAfter = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    await wait(Math.min(retryAfter, 20) * 1000 + 250);
    return spotifyFetch<T>(accessToken, path, init, attempt + 1);
  }
  if (response.status === 401) {
    throw new ProviderAuthError("spotify", "Spotify rejected the access token");
  }
  if (response.status === 204) {
    return undefined as T;
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(body.error?.message || `Spotify API error (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function getSpotifyAccount(accessToken: string): Promise<SpotifyAccount> {
  const me = await spotifyFetch<{ id: string; display_name?: string; email?: string }>(
    accessToken,
    "/me"
  );
  return { id: me.id, label: me.display_name || me.id };
}

export async function listSpotifyPlaylists(
  accessToken: string,
  ownerId: string
): Promise<SpotifyPlaylist[]> {
  type Item = {
    id: string;
    name: string;
    public: boolean | null;
    owner?: { id?: string };
    tracks?: { total?: number };
    external_urls?: { spotify?: string };
  };
  const playlists: SpotifyPlaylist[] = [];
  let url: string | undefined = "/me/playlists?limit=50";
  for (let page = 0; page < 20 && url; page++) {
    const data: { items?: Item[]; next?: string | null } = await spotifyFetch(accessToken, url);
    for (const item of data.items ?? []) {
      // Only playlists the owner can actually write to.
      if (item.owner?.id && item.owner.id !== ownerId) continue;
      playlists.push({
        id: item.id,
        name: item.name,
        trackCount: item.tracks?.total ?? 0,
        isPublic: item.public === true,
        url: item.external_urls?.spotify,
      });
    }
    url = data.next ?? undefined;
  }
  return playlists;
}

type SearchTrack = {
  id: string;
  uri: string;
  name: string;
  duration_ms: number;
  explicit?: boolean;
  external_ids?: { isrc?: string };
  artists?: { name: string }[];
  album?: { name?: string; images?: { url: string }[] };
};

function toCandidate(track: SearchTrack): SpotifyCandidate {
  return {
    id: track.id,
    uri: track.uri,
    name: track.name,
    artists: (track.artists ?? []).map((artist) => artist.name),
    album: track.album?.name,
    durationSec: Math.round(track.duration_ms / 1000),
    albumArt: track.album?.images?.[track.album.images.length - 1]?.url,
    explicit: track.explicit,
    isrc: track.external_ids?.isrc,
  };
}

export async function searchTracks(
  accessToken: string,
  query: string,
  limit = 8
): Promise<SpotifyCandidate[]> {
  const url = `/search?type=track&limit=${limit}&q=${encodeURIComponent(query)}`;
  const data = await spotifyFetch<{ tracks?: { items?: SearchTrack[] } }>(accessToken, url);
  return (data.tracks?.items ?? []).map(toCandidate);
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string
): Promise<SpotifyPlaylist> {
  const data = await spotifyFetch<{
    id: string;
    name: string;
    public: boolean | null;
    external_urls?: { spotify?: string };
  }>(accessToken, `/users/${encodeURIComponent(userId)}/playlists`, {
    method: "POST",
    // Private by default: copying a personal listening history somewhere public
    // is not a decision to make on the owner's behalf.
    body: JSON.stringify({ name, description, public: false }),
  });
  return {
    id: data.id,
    name: data.name,
    trackCount: 0,
    isPublic: data.public === true,
    url: data.external_urls?.spotify,
  };
}

/** Track uris already in a playlist, so a re-run doesn't duplicate them. */
export async function getPlaylistTrackUris(
  accessToken: string,
  playlistId: string
): Promise<Set<string>> {
  const uris = new Set<string>();
  let url: string | undefined = `/playlists/${playlistId}/tracks?limit=100&fields=items(track(uri)),next`;
  for (let page = 0; page < 50 && url; page++) {
    const data: { items?: { track?: { uri?: string } | null }[]; next?: string | null } =
      await spotifyFetch(accessToken, url);
    for (const item of data.items ?? []) {
      if (item.track?.uri) uris.add(item.track.uri);
    }
    url = data.next ?? undefined;
  }
  return uris;
}

/** Appends in the API's maximum 100-uri batches, preserving order. */
export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[]
): Promise<number> {
  let added = 0;
  for (let index = 0; index < uris.length; index += 100) {
    const batch = uris.slice(index, index + 100);
    try {
      await spotifyFetch(accessToken, `/playlists/${playlistId}/tracks`, {
        method: "POST",
        body: JSON.stringify({ uris: batch }),
      });
    } catch (error) {
      // Earlier batches are already committed on Spotify's side. Carry that
      // count into the error so the owner is told what actually landed.
      const reason = error instanceof Error ? error.message : "unknown error";
      throw new Error(`Added ${added} of ${uris.length} tracks before failing: ${reason}`);
    }
    added += batch.length;
  }
  return added;
}
