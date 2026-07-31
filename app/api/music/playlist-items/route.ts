import { NextRequest, NextResponse } from "next/server";
import { musicErrorResponse, requireAdmin } from "@/lib/music/api";
import { getGoogleAccessToken } from "@/lib/music/connections";
import { listPlaylistVideoIds } from "@/lib/music/youtube";

/**
 * Video ids of a YouTube playlist, in order.
 *
 * The scan is deliberately split in two: the ids are read once here, then the
 * browser feeds them back in small batches to /api/music/scan. That keeps every
 * request short (serverless functions have a hard time limit) and lets the page
 * show real progress on a long playlist.
 */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const playlistId = request.nextUrl.searchParams.get("playlistId");
  if (!playlistId || !/^[\w-]{2,64}$/.test(playlistId)) {
    return NextResponse.json({ error: "Missing or invalid playlistId" }, { status: 400 });
  }

  try {
    const token = await getGoogleAccessToken();
    const videoIds = await listPlaylistVideoIds(token, playlistId);
    return NextResponse.json({ videoIds, total: videoIds.length });
  } catch (error) {
    return musicErrorResponse(error);
  }
}
