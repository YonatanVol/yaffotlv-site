/**
 * Turning a YouTube video into "artist + song", and deciding whether a Spotify
 * search result is really the same recording.
 *
 * Everything here is pure and side-effect free so it can be unit-tested against
 * real-world title shapes (see lib/music-match.test.ts) — the matching quality
 * is the whole product, and it is the part most likely to regress silently.
 */

/** YouTube's category id for Music. The primary signal that a video is a song. */
export const MUSIC_CATEGORY_ID = "10";

export type TrackVariant = {
  remix: boolean;
  live: boolean;
  acoustic: boolean;
  cover: boolean;
};

export type ParsedTitle = {
  /** Best guess at the performer, or null when the title gave nothing usable. */
  artist: string | null;
  track: string;
  featured: string[];
  variant: TrackVariant;
  /** The title with only obvious junk removed — used for fallback searching. */
  cleaned: string;
};

export type SpotifyCandidate = {
  id: string;
  uri: string;
  name: string;
  artists: string[];
  album?: string;
  durationSec: number;
  albumArt?: string;
  explicit?: boolean;
  isrc?: string;
};

export type MatchConfidence = "high" | "medium" | "low";

export type ScoredCandidate = {
  candidate: SpotifyCandidate;
  score: number;
  confidence: MatchConfidence;
};

/* ── Text helpers ──────────────────────────────────────────────────── */

/** Lowercase, strip diacritics and punctuation, collapse whitespace. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`´]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Dice coefficient over character bigrams: 1 = identical, 0 = nothing shared. */
export function similarity(a: string, b: string): number {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.length < 2 || y.length < 2) return x === y ? 1 : 0;

  const bigrams = new Map<string, number>();
  for (let i = 0; i < x.length - 1; i++) {
    const bigram = x.slice(i, i + 2);
    bigrams.set(bigram, (bigrams.get(bigram) ?? 0) + 1);
  }
  let hits = 0;
  for (let i = 0; i < y.length - 1; i++) {
    const bigram = y.slice(i, i + 2);
    const count = bigrams.get(bigram) ?? 0;
    if (count > 0) {
      bigrams.set(bigram, count - 1);
      hits++;
    }
  }
  return (2 * hits) / (x.length - 1 + (y.length - 1));
}

/** `PT4M13S` → 253. Returns 0 for anything unparseable. */
export function parseIsoDuration(iso: string | undefined | null): number {
  if (!iso) return 0;
  const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, d, h, m, s] = match;
  return (
    Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0)
  );
}

/* ── Title parsing ─────────────────────────────────────────────────── */

/** Bracketed or trailing fragments that say nothing about which recording this is. */
const NOISE = [
  /^official\b.*\bvideo$/,
  /^official\b.*\baudio$/,
  /^official\b.*\bvisuali[sz]er$/,
  /^official$/,
  /^officiel(le)?$/,
  /\b(music|lyrics?|lyric)\s*video\b/,
  /^lyrics?$/,
  /^audio$/,
  /^video$/,
  /^visuali[sz]er$/,
  /^m\/?v$/,
  /^hd$/,
  /^hq$/,
  /^full hd$/,
  /^[248]k( uhd)?$/,
  /^\d{3,4}p$/,
  /^explicit$/,
  /^clip officiel$/,
  /^videoclip$/,
  /^out now$/,
  /^free download$/,
  /^new song( \d{4})?$/,
  /^\d{4}$/,
  /^with lyrics$/,
  /^color coded/,
  /^(han|rom|eng)([ /|+]+(han|rom|eng))*( lyrics?)?$/,
  /^sub(titulado|titles|s)?( espa(n|ñ)ol)?$/,
  /^letra(s)?$/,
  /^legendado$/,
  /^tradu(c|ç)(a|ã)o$/,
  /^prod\.?\s/,
  /^dir(ected)?\.?\s*by\s/,
  /^shot by\s/,
];

/** The subset of NOISE that matches a whole fragment, checked before MEANINGFUL. */
const ANCHORED_NOISE = NOISE.filter((pattern) => pattern.source.startsWith("^"));

/** Bracketed fragments that DO identify a specific recording and must survive. */
const MEANINGFUL = /\b(remix|rmx|bootleg|edit|mix|version|ver|live|acoustic|unplugged|instrumental|cover|remaster(ed)?|demo|reprise|radio|extended|club|dub|vip|slowed|sped up|orchestral|piano|karaoke|feat|ft|featuring|with)\b/;

function isNoiseFragment(fragment: string): boolean {
  const value = normalize(fragment);
  if (!value) return true;
  // Anchored noise wins over the keyword allowlist. "with lyrics" contains
  // "with", which MEANINGFUL would otherwise protect, leaving the promo text
  // in the title and in the Spotify query.
  if (ANCHORED_NOISE.some((pattern) => pattern.test(value))) return true;
  if (MEANINGFUL.test(value)) return false;
  return NOISE.some((pattern) => pattern.test(value));
}

/** Removes `(...)`, `[...]` and `{...}` groups that carry no recording info. */
export function stripNoiseFragments(title: string): string {
  const cleaned = title.replace(/[([{]([^()[\]{}]*)[)\]}]/g, (whole, inner: string) =>
    isNoiseFragment(inner) ? " " : whole
  );
  return cleaned.replace(/\s{2,}/g, " ").trim();
}

/** Trailing `| Some Channel`, `｜`, and stray separators left behind by stripping. */
function stripTrailingNoise(title: string): string {
  // Filter the segments and rejoin. Replacing each noisy part inside the
  // accumulating string would drop the *first* substring match rather than the
  // segment that was tested, and shift every later segment out of alignment.
  return title
    .split(/[|｜]/)
    .filter((part) => !isNoiseFragment(part))
    .join(" ")
    .replace(/\s*[-–—]\s*$/, "")
    .replace(/^\s*[-–—]\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const FEATURE_RE = /\b(?:feat|ft|featuring|con|avec)\.?\s+([^([{)\]}]+)/i;

function extractFeatured(value: string): { text: string; featured: string[] } {
  const match = FEATURE_RE.exec(value);
  if (!match) return { text: value, featured: [] };
  const featured = match[1]
    .split(/,|&|\band\b|\bx\b/i)
    .map((name) => name.trim())
    .filter(Boolean);
  // Also drop the wrapping brackets if the feature credit filled one.
  const text = value
    .replace(new RegExp(`[([{]\\s*${escapeRegExp(match[0])}\\s*[)\\]}]`, "i"), " ")
    .replace(match[0], " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { text, featured };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectVariant(title: string): TrackVariant {
  const value = normalize(title);
  return {
    remix: /\b(remix|rmx|bootleg|flip|vip mix|mashup)\b/.test(value),
    live: /\b(live|concert|in concert|unplugged|session|tiny desk)\b/.test(value),
    acoustic: /\b(acoustic|piano version|stripped)\b/.test(value),
    cover: /\b(cover|covered by|karaoke|tribute)\b/.test(value),
  };
}

/**
 * "Artist Name - Topic", "ArtistVEVO", "Artist Official" → "Artist Name".
 *
 * Only *trailing* decorations are removed: plenty of real acts have "Music" or
 * "Records" inside their name (Music Travel Love, The Records).
 */
export function cleanChannelName(channelTitle: string): string {
  let value = channelTitle.replace(/\s*-\s*Topic\s*$/i, "").replace(/VEVO\s*$/i, "");
  let previous = "";
  while (value !== previous) {
    previous = value;
    value = value
      .replace(/[\s-]+(official|officiel|music|channel|tv|hd|records?|recordings)\s*$/i, "")
      .trim();
  }
  return value.trim() || channelTitle.trim();
}

const DASH_SPLIT = /\s+[-–—−~]\s+|\s*[|｜]\s*|\s+"\s*/;

/**
 * Splits a video title into artist and track.
 *
 * Handles the dominant shapes: `Artist - Title`, `Artist "Title"`,
 * `Artist – Title (Official Video)`, and art-track uploads where the channel
 * (`Artist - Topic`) carries the artist and the title is the song alone.
 */
export function parseVideoTitle(title: string, channelTitle = ""): ParsedTitle {
  const channelArtist = cleanChannelName(channelTitle);
  const isArtTrack = /-\s*Topic\s*$/i.test(channelTitle);

  const variant = detectVariant(title);
  const withoutNoise = stripTrailingNoise(stripNoiseFragments(title));
  const { text, featured } = extractFeatured(withoutNoise);
  const cleaned = stripTrailingNoise(text) || withoutNoise || title;

  // Art tracks are machine-generated: the title is exactly the song name.
  if (isArtTrack && channelArtist) {
    return { artist: channelArtist, track: cleaned, featured, variant, cleaned };
  }

  const parts = cleaned
    .split(DASH_SPLIT)
    .map((part) => part.replace(/["“”]/g, "").trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const [first, ...rest] = parts;
    // Guard against titles that merely contain a dash inside the song name:
    // an artist segment is short and doesn't look like a sentence fragment.
    const looksLikeArtist = first.length <= 45 && first.split(/\s+/).length <= 6;
    if (looksLikeArtist) {
      return {
        artist: first,
        track: rest.join(" - ").trim(),
        featured,
        variant,
        cleaned,
      };
    }
  }

  return {
    artist: channelArtist || null,
    track: cleaned,
    featured,
    variant,
    cleaned,
  };
}

/* ── Search + scoring ──────────────────────────────────────────────── */

/**
 * Spotify queries to try in order, best-structured first. Field filters
 * (`track:`/`artist:`) are precise but brittle, so a loose query follows.
 */
export function buildSearchQueries(parsed: ParsedTitle): string[] {
  const queries: string[] = [];
  const track = parsed.track.replace(/["]/g, "").trim();
  const artist = parsed.artist?.replace(/["]/g, "").trim();

  if (track && artist) {
    queries.push(`track:${track} artist:${artist}`);
    queries.push(`${artist} ${track}`);
  }
  if (track) queries.push(track);
  if (parsed.cleaned && !queries.includes(parsed.cleaned)) queries.push(parsed.cleaned);

  return queries.filter((query, index, all) => query.length > 1 && all.indexOf(query) === index);
}

function durationScore(youtubeSec: number, spotifySec: number): number {
  if (!youtubeSec || !spotifySec) return 0.5; // unknown — stay neutral
  const delta = Math.abs(youtubeSec - spotifySec);
  if (delta <= 3) return 1;
  if (delta >= 30) return 0;
  return 1 - (delta - 3) / 27;
}

function artistScore(parsed: ParsedTitle, candidate: SpotifyCandidate): number {
  const haystack = normalize(`${parsed.artist ?? ""} ${parsed.cleaned} ${parsed.featured.join(" ")}`);
  let best = 0;
  for (const artist of candidate.artists) {
    const name = normalize(artist);
    if (!name) continue;
    // A containment hit is as good as it gets: "Queen" inside "Queen - Bohemian…".
    if (haystack.includes(name)) return 1;
    if (parsed.artist) best = Math.max(best, similarity(parsed.artist, artist));
  }
  return best;
}

/** 0–100. Blends title, artist and duration agreement, then penalizes variant drift. */
export function scoreCandidate(
  parsed: ParsedTitle,
  candidate: SpotifyCandidate,
  youtubeDurationSec: number
): number {
  const title = Math.max(
    similarity(parsed.track, candidate.name),
    // Some titles never split cleanly; compare the whole thing too.
    similarity(parsed.cleaned, `${candidate.artists.join(" ")} ${candidate.name}`)
  );
  const artist = artistScore(parsed, candidate);
  const duration = durationScore(youtubeDurationSec, candidate.durationSec);

  let score = (0.5 * title + 0.35 * artist + 0.15 * duration) * 100;

  const candidateVariant = detectVariant(`${candidate.name} ${candidate.album ?? ""}`);
  for (const key of ["remix", "live", "acoustic"] as const) {
    if (parsed.variant[key] !== candidateVariant[key]) score -= 18;
  }
  // A studio original answering a "cover" upload is a different recording, but
  // it is usually the song the owner actually wants — only a light penalty.
  if (parsed.variant.cover && !candidateVariant.cover) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function confidenceFor(score: number): MatchConfidence {
  if (score >= 78) return "high";
  if (score >= 58) return "medium";
  return "low";
}

/** Picks the best-scoring candidate; returns null when nothing scores at all. */
export function chooseMatch(
  parsed: ParsedTitle,
  candidates: SpotifyCandidate[],
  youtubeDurationSec: number
): ScoredCandidate | null {
  let best: ScoredCandidate | null = null;
  for (const candidate of candidates) {
    const score = scoreCandidate(parsed, candidate, youtubeDurationSec);
    if (!best || score > best.score) {
      best = { candidate, score, confidence: confidenceFor(score) };
    }
  }
  return best;
}

/* ── Non-song detection ────────────────────────────────────────────── */

const LONG_FORM = /\b(full album|album completo|greatest hits|megamix|dj set|liveset|live set|mixtape|compilation|non ?stop|playlist|hour(s)? of|best of|continuous mix|radio show|podcast|episode)\b/;

/**
 * True for uploads that sit in the Music category but aren't a single track —
 * hour-long mixes, full albums, DJ sets. Copying these to Spotify produces
 * nonsense matches, so they are surfaced as skipped rather than guessed at.
 */
export function isLongFormUpload(title: string, durationSec: number): boolean {
  if (LONG_FORM.test(normalize(title))) return true;
  return durationSec > 20 * 60;
}
