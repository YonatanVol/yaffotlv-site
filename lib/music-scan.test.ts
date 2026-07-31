import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { scanVideo } from "./music/scan";
import type { YouTubeVideo } from "./music/youtube";

/**
 * End-to-end over the scan pipeline (classify → parse → search → decide) with
 * Spotify's search stubbed out, so the decisions the owner sees are pinned
 * without any network access.
 */

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

type StubTrack = { name: string; artists: string[]; durationSec: number; id?: string };

/** Answers every Spotify search with the same canned result set. */
function stubSpotify(tracks: StubTrack[], onQuery?: (query: string) => void) {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    onQuery?.(decodeURIComponent(new URL(url).searchParams.get("q") ?? ""));
    return new Response(
      JSON.stringify({
        tracks: {
          items: tracks.map((track, index) => ({
            id: track.id ?? `id${index}`,
            uri: `spotify:track:${track.id ?? `id${index}`}`,
            name: track.name,
            duration_ms: track.durationSec * 1000,
            artists: track.artists.map((name) => ({ name })),
            album: { name: "An Album", images: [{ url: "https://i.scdn.co/image/x" }] },
          })),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;
}

function video(partial: Partial<YouTubeVideo>): YouTubeVideo {
  return {
    id: "vid",
    title: "a-ha - Take On Me (Official Video)",
    channelTitle: "a-ha",
    categoryId: "10",
    topicCategories: [],
    durationSec: 225,
    ...partial,
  };
}

test("a clear music video is matched and needs no review", async () => {
  stubSpotify([{ name: "Take On Me", artists: ["a-ha"], durationSec: 225 }]);
  const result = await scanVideo("token", video({}));
  assert.equal(result.status, "matched");
  assert.equal(result.match?.name, "Take On Me");
  assert.equal(result.match?.uri, "spotify:track:id0");
});

test("a non-music video is skipped without touching Spotify", async () => {
  let searched = false;
  stubSpotify([], () => {
    searched = true;
  });
  const result = await scanVideo(
    "token",
    video({ title: "How to tile a bathroom", channelTitle: "DIY Guy", categoryId: "26" })
  );
  assert.equal(result.status, "skipped");
  assert.match(result.note, /Not music/);
  assert.equal(searched, false);
});

test("an hour-long mix in the music category is skipped", async () => {
  stubSpotify([]);
  const result = await scanVideo(
    "token",
    video({ title: "Deep House Mix 2024 | 1 Hour DJ Set", durationSec: 3600 })
  );
  assert.equal(result.status, "skipped");
  assert.match(result.note, /Mix, DJ set or full album/);
});

test("a video on an auto-generated artist channel counts as music", async () => {
  stubSpotify([{ name: "Get Lucky", artists: ["Daft Punk"], durationSec: 369 }]);
  const result = await scanVideo(
    "token",
    video({
      title: "Get Lucky",
      channelTitle: "Daft Punk - Topic",
      categoryId: "24",
      durationSec: 369,
    })
  );
  assert.equal(result.status, "matched");
  assert.equal(result.match?.artists[0], "Daft Punk");
});

test("nothing convincing on Spotify leaves the track unmatched, with near-misses", async () => {
  stubSpotify([{ name: "Completely Different Song", artists: ["Nobody"], durationSec: 100 }]);
  const result = await scanVideo("token", video({}));
  assert.equal(result.status, "unmatched");
  assert.equal(result.match, undefined);
  assert.equal(result.alternatives.length, 1);
});

test("a plausible but imperfect match is flagged for review, not auto-copied", async () => {
  stubSpotify([{ name: "Take On Me - Live", artists: ["a-ha"], durationSec: 260 }]);
  const result = await scanVideo("token", video({}));
  assert.equal(result.status, "review");
  assert.ok(result.match);
});

test("an empty search result is reported rather than guessed at", async () => {
  stubSpotify([]);
  const result = await scanVideo("token", video({}));
  assert.equal(result.status, "unmatched");
  assert.match(result.note, /Nothing found/);
});
