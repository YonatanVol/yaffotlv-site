/**
 * The bridge: YouTube videos in, Spotify match decisions out.
 *
 * Nothing here writes to Spotify. A scan only proposes; the owner reviews the
 * result and the transfer route is what actually adds tracks.
 */

import {
  buildSearchQueries,
  chooseMatch,
  confidenceFor,
  isLongFormUpload,
  parseVideoTitle,
  scoreCandidate,
  type MatchConfidence,
  type SpotifyCandidate,
} from "./match";
import { searchTracks } from "./spotify";
import { classifyMusic, type YouTubeVideo } from "./youtube";

export type ScanStatus = "matched" | "review" | "unmatched" | "skipped";

export type ScannedTrack = {
  videoId: string;
  videoTitle: string;
  channelTitle: string;
  thumbnail?: string;
  durationSec: number;
  status: ScanStatus;
  /** Why a video was skipped, or which signal marked it as music. */
  note: string;
  parsedArtist: string | null;
  parsedTrack: string;
  match?: SpotifyCandidate & { score: number; confidence: MatchConfidence };
  /** Runner-up candidates, so a wrong guess can be corrected without searching again. */
  alternatives: (SpotifyCandidate & { score: number })[];
};

/** Scores at or above this are added without the owner having to look. */
const AUTO_ACCEPT = 78;
/** Below this a candidate is not worth showing as "the match". */
const PLAUSIBLE = 45;

/** Small parallelism: fast enough for a page of videos, gentle on Spotify's rate limit. */
const CONCURRENCY = 4;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

export async function scanVideo(
  spotifyToken: string,
  video: YouTubeVideo
): Promise<ScannedTrack> {
  const base = {
    videoId: video.id,
    videoTitle: video.title,
    channelTitle: video.channelTitle,
    thumbnail: video.thumbnail,
    durationSec: video.durationSec,
    alternatives: [],
  };

  const music = classifyMusic(video);
  const parsed = parseVideoTitle(video.title, video.channelTitle);

  if (!music.isMusic) {
    return {
      ...base,
      status: "skipped",
      note: "Not music — skipped",
      parsedArtist: parsed.artist,
      parsedTrack: parsed.track,
    };
  }
  if (isLongFormUpload(video.title, video.durationSec)) {
    return {
      ...base,
      status: "skipped",
      note: "Mix, DJ set or full album — not a single track",
      parsedArtist: parsed.artist,
      parsedTrack: parsed.track,
    };
  }

  // Try the structured query first and stop as soon as something is clearly
  // right — most tracks resolve on the first search, which keeps the scan quick.
  const seen = new Map<string, SpotifyCandidate>();
  let best: ReturnType<typeof chooseMatch> = null;

  for (const query of buildSearchQueries(parsed)) {
    const candidates = await searchTracks(spotifyToken, query);
    for (const candidate of candidates) seen.set(candidate.id, candidate);

    best = chooseMatch(parsed, [...seen.values()], video.durationSec);
    if (best && best.score >= AUTO_ACCEPT) break;
  }

  const ranked = [...seen.values()]
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(parsed, candidate, video.durationSec),
    }))
    .sort((a, b) => b.score - a.score);

  if (!best || best.score < PLAUSIBLE) {
    return {
      ...base,
      status: "unmatched",
      note: seen.size ? "No convincing match on Spotify" : "Nothing found on Spotify",
      parsedArtist: parsed.artist,
      parsedTrack: parsed.track,
      // Still offer the near-misses — a human recognises them instantly.
      alternatives: ranked.slice(0, 4),
    };
  }

  return {
    ...base,
    status: best.score >= AUTO_ACCEPT ? "matched" : "review",
    note: music.reason,
    parsedArtist: parsed.artist,
    parsedTrack: parsed.track,
    match: { ...best.candidate, score: best.score, confidence: confidenceFor(best.score) },
    alternatives: ranked.filter((candidate) => candidate.id !== best!.candidate.id).slice(0, 4),
  };
}

export async function scanVideos(
  spotifyToken: string,
  videos: YouTubeVideo[]
): Promise<ScannedTrack[]> {
  return mapWithConcurrency(videos, CONCURRENCY, (video) => scanVideo(spotifyToken, video));
}
