import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { musicErrorResponse, requireAdmin } from "@/lib/music/api";
import { getGoogleAccessToken, getSpotifyAccessToken } from "@/lib/music/connections";
import { getVideos } from "@/lib/music/youtube";
import { scanVideos } from "@/lib/music/scan";

/** One batch of videos: read their details, drop non-music, look each up on Spotify. */
const schema = z.object({
  // 25 keeps a batch comfortably inside the function time limit even when every
  // track needs several Spotify searches.
  videoIds: z.array(z.string().min(1).max(64)).min(1).max(25),
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const googleToken = await getGoogleAccessToken();
    const { token: spotifyToken } = await getSpotifyAccessToken();

    const videos = await getVideos(googleToken, parsed.data.videoIds);
    const tracks = await scanVideos(spotifyToken, videos);

    return NextResponse.json({ tracks });
  } catch (error) {
    return musicErrorResponse(error);
  }
}
