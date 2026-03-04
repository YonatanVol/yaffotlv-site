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
