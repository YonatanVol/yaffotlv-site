import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthClient, getSpotifyOAuthClient } from "@/lib/env";
import { isProvider, oauthRedirectUri, requireAdmin } from "@/lib/music/api";
import { stashOAuthState } from "@/lib/music/session";
import { googleAuthUrl } from "@/lib/music/youtube";
import { spotifyAuthUrl } from "@/lib/music/spotify";

/**
 * Starts the OAuth dance for one provider.
 *
 * A random `state` is stored in a short-lived encrypted cookie so the callback
 * can prove the authorization it receives belongs to a flow this browser began.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { provider } = await params;
  if (!isProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  }

  const state = crypto.randomUUID();
  await stashOAuthState(provider, state);
  const redirectUri = oauthRedirectUri(request, provider);

  try {
    const url =
      provider === "google"
        ? googleAuthUrl({ clientId: getGoogleOAuthClient().id, redirectUri, state })
        : spotifyAuthUrl({ clientId: getSpotifyOAuthClient().id, redirectUri, state });
    return NextResponse.redirect(url);
  } catch (error) {
    // A missing client id/secret is a setup problem, not a runtime blip.
    const message = error instanceof Error ? error.message : "OAuth is not configured";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
