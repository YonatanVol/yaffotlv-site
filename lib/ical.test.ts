import { test } from "node:test";
import assert from "node:assert/strict";
import { generateICalendar } from "./ical";

const NOW = new Date("2026-06-24T09:00:00Z");

test("emits a valid VCALENDAR with CRLF endings and an exclusive DTEND", () => {
  const out = generateICalendar(
    [{ uid: "r1@yaffotlv.com", summary: "Booked", start: "2026-07-10", end: "2026-07-13" }],
    { now: NOW }
  );
  assert.match(out, /BEGIN:VCALENDAR/);
  assert.match(out, /END:VCALENDAR/);
  assert.match(out, /DTSTART;VALUE=DATE:20260710/);
  assert.match(out, /DTEND;VALUE=DATE:20260713/); // checkout day stays free
  assert.match(out, /DTSTAMP:20260624T090000Z/);
  assert.ok(out.includes("\r\n"));
});

test("escapes semicolons and commas in the summary", () => {
  const out = generateICalendar(
    [{ uid: "m1", summary: "Blocked; painting, repairs", start: "2026-08-01", end: "2026-08-03" }],
    { now: NOW }
  );
  assert.match(out, /SUMMARY:Blocked\\; painting\\, repairs/);
});
