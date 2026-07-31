import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { musicErrorResponse, requireAdmin } from "@/lib/music/api";
import { getSpotifyAccessToken } from "@/lib/music/connections";
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylistTrackUris,
} from "@/lib/music/spotify";

/**
 * The only route that writes to Spotify.
 *
 * It takes the exact track uris the owner confirmed on the page — the matching
 * decision is never re-made here — and appends the ones the target playlist
 * doesn't already contain, so re-running a transfer is safe.
 */
const schema = z.object({
  uris: z.array(z.string().regex(/^spotify:track:[A-Za-z0-9]{10,40}$/)).min(1).max(1000),
  target: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("new"), name: z.string().min(1).max(100) }),
    z.object({ mode: z.literal("existing"), playlistId: z.string().min(1).max(64) }),
  ]),
  sourceName: z.string().max(150).optional(),
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { uris, target, sourceName } = parsed.data;

  try {
    const { token, userId } = await getSpotifyAccessToken();

    const playlist =
      target.mode === "new"
        ? await createPlaylist(
            token,
            userId,
            target.name,
            sourceName
              ? `Copied from the YouTube playlist "${sourceName}".`
              : "Copied from YouTube."
          )
        : { id: target.playlistId, name: "", url: undefined as string | undefined };

    const existing =
      target.mode === "existing" ? await getPlaylistTrackUris(token, playlist.id) : new Set<string>();

    // De-duplicate within the request too: two YouTube uploads often resolve to
    // the same Spotify recording.
    const seen = new Set<string>();
    const toAdd = uris.filter((uri) => {
      if (existing.has(uri) || seen.has(uri)) return false;
      seen.add(uri);
      return true;
    });

    const added = toAdd.length ? await addTracksToPlaylist(token, playlist.id, toAdd) : 0;

    return NextResponse.json({
      added,
      skipped: uris.length - added,
      playlistId: playlist.id,
      playlistUrl: playlist.url ?? `https://open.spotify.com/playlist/${playlist.id}`,
    });
  } catch (error) {
    return musicErrorResponse(error);
  }
}
