/**
 * Hands out usable access tokens, refreshing them behind the scenes.
 *
 * Every API route asks for tokens through here rather than reading the cookie
 * directly, so a token that expired mid-transfer is renewed once and written
 * back instead of surfacing as a confusing 401 half way through a playlist.
 */

import { getGoogleOAuthClient, getSpotifyOAuthClient } from "@/lib/env";
import { readConnections, saveConnection, type Provider } from "./session";
import { refreshGoogleToken } from "./youtube";
import { refreshSpotifyToken } from "./spotify";

/** The owner hasn't linked this provider (or the link was dropped). */
export class NotConnectedError extends Error {
  constructor(public provider: Provider) {
    super(`${provider} is not connected`);
    this.name = "NotConnectedError";
  }
}

/** Refresh this far ahead of expiry so a long scan can't expire mid-flight. */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export async function getGoogleAccessToken(): Promise<string> {
  const connection = (await readConnections()).google;
  if (!connection) throw new NotConnectedError("google");

  if (connection.expiresAt - Date.now() > REFRESH_MARGIN_MS) return connection.accessToken;
  if (!connection.refreshToken) throw new NotConnectedError("google");

  const client = getGoogleOAuthClient();
  const tokens = await refreshGoogleToken({
    refreshToken: connection.refreshToken,
    clientId: client.id,
    clientSecret: client.secret,
  });
  await saveConnection("google", { ...connection, ...tokens });
  return tokens.accessToken;
}

export async function getSpotifyAccessToken(): Promise<{ token: string; userId: string }> {
  const connection = (await readConnections()).spotify;
  if (!connection?.accountId) throw new NotConnectedError("spotify");

  if (connection.expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return { token: connection.accessToken, userId: connection.accountId };
  }
  if (!connection.refreshToken) throw new NotConnectedError("spotify");

  const client = getSpotifyOAuthClient();
  const tokens = await refreshSpotifyToken({
    refreshToken: connection.refreshToken,
    clientId: client.id,
    clientSecret: client.secret,
  });
  await saveConnection("spotify", { ...connection, ...tokens });
  return { token: tokens.accessToken, userId: connection.accountId };
}
