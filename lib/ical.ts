import ICAL from "ical.js";
import { dateRange } from "./dates";

interface CalendarEvent {
  uid: string;
  summary: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

/** Fetch and parse an iCal URL into calendar events */
export async function fetchCalendar(url: string): Promise<CalendarEvent[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch calendar: ${response.status}`);
  }
  const text = await response.text();
  return parseICS(text);
}

/** Parse raw ICS text into calendar events */
export function parseICS(icsText: string): CalendarEvent[] {
  const jcal = ICAL.parse(icsText);
  const comp = new ICAL.Component(jcal);
  const vevents = comp.getAllSubcomponents("vevent");

  return vevents.map((vevent) => {
    const event = new ICAL.Event(vevent);
    const start = event.startDate;
    const end = event.endDate;

    return {
      uid: event.uid || "",
      summary: event.summary || "Blocked",
      startDate: `${start.year}-${String(start.month).padStart(2, "0")}-${String(start.day).padStart(2, "0")}`,
      endDate: `${end.year}-${String(end.month).padStart(2, "0")}-${String(end.day).padStart(2, "0")}`,
    };
  });
}

/** Escape text per RFC 5545 (backslash, semicolon, comma, newline). */
function escapeICalText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Format a Date as a UTC iCal timestamp "YYYYMMDDTHHMMSSZ". */
function formatICalStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

interface ICalEvent {
  uid: string;
  summary: string;
  start: string; // "YYYY-MM-DD" inclusive
  end: string; // "YYYY-MM-DD" EXCLUSIVE (checkout day stays free)
}

/**
 * Build a valid VCALENDAR (RFC 5545) of all-day blocked ranges, with CRLF line
 * endings. DTEND is exclusive, matching iCal's DATE semantics (so the checkout
 * day is left available). Used by the published feed Airbnb/Booking import.
 */
export function generateICalendar(
  events: ICalEvent[],
  opts: { prodId?: string; calName?: string; now?: Date } = {}
): string {
  const prodId = opts.prodId ?? "-//YaffoTLV//Booking Calendar//EN";
  const dtstamp = formatICalStamp(opts.now ?? new Date());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${prodId}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  if (opts.calName) lines.push(`X-WR-CALNAME:${escapeICalText(opts.calName)}`);

  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${ev.start.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${ev.end.replace(/-/g, "")}`,
      `SUMMARY:${escapeICalText(ev.summary)}`,
      "TRANSP:OPAQUE",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** Expand events into individual blocked date records */
export function expandEvents(
  events: CalendarEvent[]
): Array<{ date: string; uid: string; summary: string }> {
  const results: Array<{ date: string; uid: string; summary: string }> = [];

  for (const event of events) {
    // iCal DTEND for DATE type is exclusive (check-out day is free)
    const dates = dateRange(event.startDate, event.endDate);
    for (const date of dates) {
      results.push({
        date,
        uid: event.uid,
        summary: event.summary,
      });
    }
  }

  return results;
}
