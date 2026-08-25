import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildSearchQueries,
  chooseMatch,
  cleanChannelName,
  isLongFormUpload,
  normalize,
  parseIsoDuration,
  parseVideoTitle,
  scoreCandidate,
  similarity,
  stripNoiseFragments,
  type SpotifyCandidate,
} from "./music/match";

/* ── Duration ──────────────────────────────────────────────────────── */

test("parseIsoDuration handles the shapes YouTube returns", () => {
  assert.equal(parseIsoDuration("PT4M13S"), 253);
  assert.equal(parseIsoDuration("PT1H2M3S"), 3723);
  assert.equal(parseIsoDuration("PT45S"), 45);
  assert.equal(parseIsoDuration("PT2M"), 120);
  assert.equal(parseIsoDuration("P1DT1H"), 90000);
  assert.equal(parseIsoDuration(undefined), 0);
  assert.equal(parseIsoDuration("garbage"), 0);
});

/* ── Text helpers ──────────────────────────────────────────────────── */

test("normalize folds case, accents, punctuation and ampersands", () => {
  assert.equal(normalize("Beyoncé — “Halo”!"), "beyonce halo");
  assert.equal(normalize("Simon & Garfunkel"), "simon and garfunkel");
  assert.equal(normalize("Don't Stop Me Now"), "dont stop me now");
});

test("similarity is 1 for equivalent strings and low for unrelated ones", () => {
  assert.equal(similarity("Bohemian Rhapsody", "bohemian rhapsody"), 1);
  assert.ok(similarity("Bohemian Rhapsody", "Bohemian Rapsody") > 0.85);
  assert.ok(similarity("Bohemian Rhapsody", "Smells Like Teen Spirit") < 0.3);
  assert.equal(similarity("", "anything"), 0);
});

/* ── Noise stripping ───────────────────────────────────────────────── */

test("stripNoiseFragments drops promo brackets but keeps recording info", () => {
  assert.equal(stripNoiseFragments("Take On Me (Official Video)"), "Take On Me");
  assert.equal(stripNoiseFragments("Take On Me [4K]"), "Take On Me");
  assert.equal(stripNoiseFragments("Levels (Official Music Video) [HD]"), "Levels");
  assert.equal(
    stripNoiseFragments("One More Time (Radio Edit)"),
    "One More Time (Radio Edit)"
  );
  assert.equal(
    stripNoiseFragments("Silence (Illenium Remix)"),
    "Silence (Illenium Remix)"
  );
  assert.equal(stripNoiseFragments("Hurt (Live at Folsom)"), "Hurt (Live at Folsom)");
});

test("stripNoiseFragments drops promo text that contains a meaningful keyword", () => {
  // Regression: "with lyrics" contains "with", which the MEANINGFUL allowlist
  // used to protect, so the promo text survived into the Spotify query.
  assert.equal(stripNoiseFragments("Hello (with lyrics)"), "Hello");
  assert.equal(stripNoiseFragments("Hello [With Lyrics]"), "Hello");
  // The allowlist still wins for fragments that name a specific recording.
  assert.equal(stripNoiseFragments("Hello (with Adele)"), "Hello (with Adele)");
});

test("parseVideoTitle drops only the noisy pipe segments", () => {
  // Regression: the old loop called value.replace(part, " ") on the accumulating
  // string, which removed the first substring match rather than the tested
  // segment and shifted the remaining segments out of alignment.
  const parsed = parseVideoTitle("Adele - Hello | Official Video | 4K", "AdeleVEVO");
  assert.equal(parsed.artist, "Adele");
  assert.equal(parsed.track, "Hello");

  // A repeated word across segments must not cause the wrong one to be cut.
  const repeated = parseVideoTitle("Hello - Hello | Official Video", "Someone");
  assert.equal(repeated.track, "Hello");
});

test("cleanChannelName reduces a channel to the artist", () => {
  assert.equal(cleanChannelName("Daft Punk - Topic"), "Daft Punk");
  assert.equal(cleanChannelName("RihannaVEVO"), "Rihanna");
  assert.equal(cleanChannelName("Arctic Monkeys Official"), "Arctic Monkeys");
  // Only trailing decorations go — these words are part of the act's name.
  assert.equal(cleanChannelName("Music Travel Love"), "Music Travel Love");
  assert.equal(cleanChannelName("Music"), "Music");
});

/* ── Title parsing ─────────────────────────────────────────────────── */

test("parseVideoTitle splits the common Artist - Title shape", () => {
  const parsed = parseVideoTitle("a-ha - Take On Me (Official Video)", "a-ha");
  assert.equal(parsed.artist, "a-ha");
  assert.equal(parsed.track, "Take On Me");
});

test("parseVideoTitle handles en-dash and trailing channel pipes", () => {
  const parsed = parseVideoTitle("Adele – Hello | Official Video", "AdeleVEVO");
  assert.equal(parsed.artist, "Adele");
  assert.equal(parsed.track, "Hello");
});

test("parseVideoTitle uses the channel for auto-generated art tracks", () => {
  const parsed = parseVideoTitle("Get Lucky", "Daft Punk - Topic");
  assert.equal(parsed.artist, "Daft Punk");
  assert.equal(parsed.track, "Get Lucky");
});

test("parseVideoTitle pulls out featured artists", () => {
  const parsed = parseVideoTitle("Calvin Harris - Feels (feat. Pharrell Williams)", "CalvinHarrisVEVO");
  assert.equal(parsed.artist, "Calvin Harris");
  assert.equal(parsed.track, "Feels");
  assert.deepEqual(parsed.featured, ["Pharrell Williams"]);
});

test("parseVideoTitle keeps remix and live markers as variants", () => {
  const remix = parseVideoTitle("Marshmello - Silence (Illenium Remix)", "Marshmello");
  assert.equal(remix.variant.remix, true);
  assert.match(remix.track, /Remix/);

  const live = parseVideoTitle("Johnny Cash - Hurt (Live at Folsom Prison)", "Johnny Cash");
  assert.equal(live.variant.live, true);
});

test("parseVideoTitle falls back to the channel when the title has no artist", () => {
  const parsed = parseVideoTitle("Bohemian Rhapsody", "Queen Official");
  assert.equal(parsed.artist, "Queen");
  assert.equal(parsed.track, "Bohemian Rhapsody");
});

test("parseVideoTitle does not treat a long first clause as an artist", () => {
  const parsed = parseVideoTitle(
    "The greatest song ever written about summer - and why it still matters",
    "Song Exploder"
  );
  assert.equal(parsed.artist, "Song Exploder");
});

/* ── Query building ────────────────────────────────────────────────── */

test("buildSearchQueries leads with the structured query", () => {
  const queries = buildSearchQueries(parseVideoTitle("a-ha - Take On Me (Official Video)", "a-ha"));
  assert.equal(queries[0], "track:Take On Me artist:a-ha");
  assert.ok(queries.includes("a-ha Take On Me"));
});

/* ── Scoring ───────────────────────────────────────────────────────── */

function candidate(partial: Partial<SpotifyCandidate>): SpotifyCandidate {
  return {
    id: "id",
    uri: "spotify:track:id",
    name: "Take On Me",
    artists: ["a-ha"],
    durationSec: 225,
    ...partial,
  };
}

test("scoreCandidate rewards the right recording", () => {
  const parsed = parseVideoTitle("a-ha - Take On Me (Official Video)", "a-ha");
  const score = scoreCandidate(parsed, candidate({}), 225);
  assert.ok(score >= 78, `expected a confident match, got ${score}`);
});

test("scoreCandidate punishes a different song by the same artist", () => {
  const parsed = parseVideoTitle("a-ha - Take On Me (Official Video)", "a-ha");
  const score = scoreCandidate(parsed, candidate({ name: "The Sun Always Shines on T.V." }), 225);
  assert.ok(score < 78, `expected a weak match, got ${score}`);
});

test("scoreCandidate punishes a duration that is minutes off", () => {
  const parsed = parseVideoTitle("a-ha - Take On Me (Official Video)", "a-ha");
  const close = scoreCandidate(parsed, candidate({}), 225);
  const far = scoreCandidate(parsed, candidate({ durationSec: 900 }), 225);
  assert.ok(far < close);
});

test("scoreCandidate keeps a remix from matching the original", () => {
  const parsed = parseVideoTitle("Marshmello - Silence (Illenium Remix)", "Marshmello");
  const original = scoreCandidate(
    parsed,
    candidate({ name: "Silence", artists: ["Marshmello"], durationSec: 180 }),
    240
  );
  const remix = scoreCandidate(
    parsed,
    candidate({ name: "Silence - Illenium Remix", artists: ["Marshmello"], durationSec: 240 }),
    240
  );
  assert.ok(remix > original, `remix ${remix} should beat original ${original}`);
});

test("chooseMatch picks the best-scoring candidate", () => {
  const parsed = parseVideoTitle("Queen - Bohemian Rhapsody (Official Video)", "Queen Official");
  const best = chooseMatch(
    parsed,
    [
      candidate({ id: "a", name: "Bohemian Rhapsody", artists: ["Queen"], durationSec: 354 }),
      candidate({ id: "b", name: "Radio Ga Ga", artists: ["Queen"], durationSec: 348 }),
    ],
    354
  );
  assert.equal(best?.candidate.id, "a");
  assert.equal(best?.confidence, "high");
});

test("chooseMatch returns null when there is nothing to choose from", () => {
  assert.equal(chooseMatch(parseVideoTitle("Anything", ""), [], 100), null);
});

/* ── Non-song detection ────────────────────────────────────────────── */

test("isLongFormUpload catches mixes, albums and very long videos", () => {
  assert.equal(isLongFormUpload("Deep House Mix 2024 | 1 Hour DJ Set", 3600), true);
  assert.equal(isLongFormUpload("Pink Floyd - The Wall (Full Album)", 4800), true);
  assert.equal(isLongFormUpload("Some Song", 25 * 60), true);
  assert.equal(isLongFormUpload("a-ha - Take On Me", 225), false);
});
