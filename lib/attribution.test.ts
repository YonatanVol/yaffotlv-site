import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseAttribution,
  captureAttribution,
  readAttribution,
  isEmpty,
  ATTRIBUTION_KEY,
} from "./attribution";

/** Minimal sessionStorage stand-in. */
function fakeStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    _dump: () => Object.fromEntries(map),
  };
}

test("parses utm parameters from an Instagram bio link", () => {
  const a = parseAttribution("?utm_source=instagram&utm_medium=bio&utm_campaign=summer");
  assert.equal(a.utmSource, "instagram");
  assert.equal(a.utmMedium, "bio");
  assert.equal(a.utmCampaign, "summer");
});

test("records which platform a click id came from", () => {
  assert.equal(parseAttribution("?fbclid=abc123").clickId, "fbclid:abc123");
  assert.equal(parseAttribution("?ttclid=xyz789").clickId, "ttclid:xyz789");
});

test("a plain visit yields nothing to store", () => {
  assert.equal(isEmpty(parseAttribution("")), true);
  assert.equal(isEmpty(parseAttribution("?ref=someone")), true);
});

test("first touch wins — a later bare page view cannot erase the campaign", () => {
  const storage = fakeStorage();
  // Landing from a TikTok ad…
  captureAttribution("?utm_source=tiktok&utm_campaign=reel1&ttclid=t1", storage);
  // …then navigating to /book, which carries no parameters at all.
  const after = captureAttribution("", storage);
  assert.equal(after.utmSource, "tiktok");
  assert.equal(after.clickId, "ttclid:t1");
  assert.equal(readAttribution(storage).utmCampaign, "reel1");
});

test("a second campaign in the same session does not overwrite the first", () => {
  const storage = fakeStorage();
  captureAttribution("?utm_source=instagram", storage);
  captureAttribution("?utm_source=google", storage);
  assert.equal(readAttribution(storage).utmSource, "instagram");
});

test("survives storage that throws (private browsing)", () => {
  const hostile = {
    getItem: () => {
      throw new Error("denied");
    },
    setItem: () => {
      throw new Error("denied");
    },
  };
  assert.doesNotThrow(() => captureAttribution("?utm_source=instagram", hostile));
  assert.deepEqual(readAttribution(hostile), {});
});

test("values are length-capped so a hostile URL cannot bloat storage", () => {
  const a = parseAttribution("?utm_source=" + "x".repeat(500));
  assert.equal(a.utmSource?.length, 200);
});

test("stores under the documented key", () => {
  const storage = fakeStorage();
  captureAttribution("?utm_source=instagram", storage);
  assert.ok(storage._dump()[ATTRIBUTION_KEY]);
});
