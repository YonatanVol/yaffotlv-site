/**
 * Where the mover keeps its YouTube and Spotify credentials.
 *
 * Both providers' tokens live in a single encrypted (A256GCM) cookie on the
 * owner's browser, never in the database. Two reasons: the tool is single-user
 * and interactive, so there is nothing to run in the background that would need
 * server-side tokens; and a stolen database dump then contains no keys to
 * anyone's Google or Spotify account. Signing out of /admin or clearing cookies
 * revokes the connections locally — see DECISIONS D-MM.1.
 */

import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";
import { getMusicSessionKey } from "@/lib/env";

export const CONNECTIONS_COOKIE = "music_connections";
const STATE_COOKIE = "music_oauth_state";

/** How long the encrypted cookie itself survives; refresh tokens outlive access tokens. */
const CONNECTIONS_TTL_DAYS = 30;

export type Provider = "google" | "spotify";

export type ProviderConnection = {
  accessToken: string;
  refreshToken?: string;
  /** Epoch ms at which `accessToken` stops working. */
  expiresAt: number;
  /** Human label for the connected account (channel title / Spotify display name). */
  label: string;
  /** Provider-side account id, needed by Spotify to create playlists. */
  accountId?: string;
};

export type Connections = Partial<Record<Provider, ProviderConnection>>;

const secureCookies = process.env.NODE_ENV === "production";

async function encrypt(payload: Record<string, unknown>, expires: string): Promise<string> {
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .encrypt(await getMusicSessionKey());
}

async function decrypt(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtDecrypt(token, await getMusicSessionKey());
    return payload as Record<string, unknown>;
  } catch {
    // Tampered, expired, or encrypted under a rotated JWT_SECRET — all mean
    // "no usable connection", and the owner just reconnects.
    return null;
  }
}

export async function readConnections(): Promise<Connections> {
  const raw = (await cookies()).get(CONNECTIONS_COOKIE)?.value;
  if (!raw) return {};
  const payload = await decrypt(raw);
  if (!payload || typeof payload.c !== "object" || payload.c === null) return {};
  return payload.c as Connections;
}

export async function writeConnections(connections: Connections): Promise<void> {
  const jwe = await encrypt({ c: connections }, `${CONNECTIONS_TTL_DAYS}d`);
  (await cookies()).set(CONNECTIONS_COOKIE, jwe, {
    httpOnly: true,
    secure: secureCookies,
    // "lax" (not "strict") so the cookie is still sent on the top-level
    // redirect back from Google/Spotify at the end of the OAuth dance.
    sameSite: "lax",
    path: "/",
    maxAge: CONNECTIONS_TTL_DAYS * 24 * 60 * 60,
  });
}

/** Replaces one provider's entry, leaving the other connection untouched. */
export async function saveConnection(
  provider: Provider,
  connection: ProviderConnection
): Promise<void> {
  const connections = await readConnections();
  await writeConnections({ ...connections, [provider]: connection });
}

/** Drops one provider, or both when `provider` is omitted. */
export async function clearConnections(provider?: Provider): Promise<void> {
  if (!provider) {
    (await cookies()).delete(CONNECTIONS_COOKIE);
    return;
  }
  const connections = await readConnections();
  delete connections[provider];
  await writeConnections(connections);
}

/**
 * Stores the CSRF `state` for an in-flight authorization, so the callback can
 * prove the code it was handed belongs to a flow this browser actually started.
 */
export async function stashOAuthState(provider: Provider, state: string): Promise<void> {
  const jwe = await encrypt({ provider, state }, "10m");
  (await cookies()).set(STATE_COOKIE, jwe, {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
}

/** Single-use: verifies the returned `state` and clears the cookie either way. */
export async function consumeOAuthState(provider: Provider, state: string): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(STATE_COOKIE)?.value;
  jar.delete(STATE_COOKIE);
  if (!raw || !state) return false;
  const payload = await decrypt(raw);
  return payload?.provider === provider && payload?.state === state;
}
