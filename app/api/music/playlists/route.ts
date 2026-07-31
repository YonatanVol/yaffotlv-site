import { NextRequest, NextResponse } from "next/server";
import { musicErrorResponse, requireAdmin } from "@/lib/music/api";
import { getGoogleAccessToken, getSpotifyAccessToken } from "@/lib/music/connections";
import { listPlaylists } from "@/lib/music/youtube";
import { listSpotifyPlaylists } from "@/lib/music/spotify";

/**
 * Lists playlists to copy from (`?source=youtube`) or into (`?source=spotify`).
 *
 * YouTube's "Liked videos" and "Liked Music" are intentionally absent — the API
 * does not expose them as playlists, so only real playlists can be offered.
 */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const source = request.nextUrl.searchParams.get("source") ?? "youtube";

  try {
    if (source === "spotify") {
      const { token, userId } = await getSpotifyAccessToken();
      return NextResponse.json({ playlists: await listSpotifyPlaylists(token, userId) });
    }
    const token = await getGoogleAccessToken();
    return NextResponse.json({ playlists: await listPlaylists(token) });
  } catch (error) {
    return musicErrorResponse(error);
  }
}
