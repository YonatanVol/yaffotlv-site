/**
 * Shared plumbing for the /api/music routes: the admin gate, a consistent
 * error shape, and the OAuth redirect URI both providers must agree on.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { NotConnectedError } from "./connections";
import { ProviderAuthError } from "./youtube";
import type { Provider } from "./session";

/** The mover is the owner's private tool — same session as the rest of /admin. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await getSession()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function isProvider(value: string): value is Provider {
  return value === "google" || value === "spotify";
}

/**
 * Must match the redirect URI registered in the Google and Spotify consoles
 * exactly, so it is derived from the configured site URL rather than whatever
 * host a request happened to arrive on.
 */
export function oauthRedirectUri(request: NextRequest, provider: Provider): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  return `${base.replace(/\/$/, "")}/api/music/connect/${provider}/callback`;
}

export function adminMusicUrl(request: NextRequest, params: Record<string, string>): URL {
  const base = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const url = new URL("/admin/music", base);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url;
}

/**
 * Maps the provider-specific failures onto statuses the UI can act on:
 * 409 means "reconnect this account", everything else is a plain failure.
 */
export function musicErrorResponse(error: unknown): NextResponse {
  if (error instanceof NotConnectedError) {
    return NextResponse.json(
      { error: `${error.provider} is not connected`, reconnect: error.provider },
      { status: 409 }
    );
  }
  if (error instanceof ProviderAuthError) {
    return NextResponse.json(
      { error: error.message, reconnect: error.provider },
      { status: 409 }
    );
  }
  const message = error instanceof Error ? error.message : "Something went wrong";
  console.error("[music]", message);
  return NextResponse.json({ error: message }, { status: 502 });
}
