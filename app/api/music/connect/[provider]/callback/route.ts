import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthClient, getSpotifyOAuthClient } from "@/lib/env";
import { adminMusicUrl, isProvider, oauthRedirectUri, requireAdmin } from "@/lib/music/api";
import { consumeOAuthState, saveConnection } from "@/lib/music/session";
import { exchangeGoogleCode, getChannelLabel } from "@/lib/music/youtube";
import { exchangeSpotifyCode, getSpotifyAccount } from "@/lib/music/spotify";

/**
 * Completes the OAuth dance: swaps the code for tokens, records who the tokens
 * belong to, and drops the owner back on the mover page.
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

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state") ?? "";
  const denied = request.nextUrl.searchParams.get("error");

  // The state cookie is single-use, so consume it before any early return.
  const stateOk = await consumeOAuthState(provider, state);

  if (denied) {
    return NextResponse.redirect(adminMusicUrl(request, { error: `${provider}_denied` }));
  }
  if (!stateOk || !code) {
    return NextResponse.redirect(adminMusicUrl(request, { error: `${provider}_state` }));
  }

  const redirectUri = oauthRedirectUri(request, provider);

  try {
    if (provider === "google") {
      const client = getGoogleOAuthClient();
      const tokens = await exchangeGoogleCode({
        code,
        clientId: client.id,
        clientSecret: client.secret,
        redirectUri,
      });
      const label = await getChannelLabel(tokens.accessToken);
      await saveConnection("google", { ...tokens, label });
    } else {
      const client = getSpotifyOAuthClient();
      const tokens = await exchangeSpotifyCode({
        code,
        clientId: client.id,
        clientSecret: client.secret,
        redirectUri,
      });
      const account = await getSpotifyAccount(tokens.accessToken);
      await saveConnection("spotify", { ...tokens, label: account.label, accountId: account.id });
    }
    return NextResponse.redirect(adminMusicUrl(request, { connected: provider }));
  } catch (error) {
    console.error("[music] oauth callback failed", error);
    return NextResponse.redirect(adminMusicUrl(request, { error: `${provider}_failed` }));
  }
}
