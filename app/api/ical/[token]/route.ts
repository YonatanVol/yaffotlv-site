import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations, blockedDates } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { generateICalendar } from "@/lib/ical";
import { todayJerusalem, addDays } from "@/lib/dates";
import { safeEqual } from "@/lib/env";

// Per-request data; never statically prerendered.
export const dynamic = "force-dynamic";

/**
 * Published availability feed that Airbnb / Booking.com subscribe to.
 *
 * Emits ONLY confirmed direct reservations + manual blocks — never the dates we
 * imported from Airbnb/Booking (that would create a sync loop), and never
 * transient drafts/holds. Protected by an unguessable token in the path
 * (ICAL_TOKEN env var). URL shape: /api/ical/<TOKEN>.ics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const expected = process.env.ICAL_TOKEN;
  const provided = token.replace(/\.ics$/i, "");

  // Feature disabled (no token set) or wrong token → 404, revealing nothing.
  if (!expected || !safeEqual(provided, expected)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const today = todayJerusalem();

  // Confirmed direct reservations — each is already a [checkIn, checkOut) range.
  const confirmed = await db
    .select({
      id: reservations.id,
      checkIn: reservations.checkIn,
      checkOut: reservations.checkOut,
    })
    .from(reservations)
    .where(and(eq(reservations.status, "confirmed"), gte(reservations.checkOut, today)));

  // Manual blocks are individual nights — coalesce contiguous nights into ranges.
  const manual = await db
    .select({ date: blockedDates.date })
    .from(blockedDates)
    .where(and(eq(blockedDates.source, "manual"), gte(blockedDates.date, today)));

  const events = [
    ...confirmed.map((r) => ({
      uid: `reservation-${r.id}@yaffotlv.com`,
      summary: "Booked (direct)",
      start: r.checkIn,
      end: r.checkOut, // exclusive checkout day
    })),
    ...coalesceNights(manual.map((m) => m.date)).map((rng) => ({
      uid: `manual-${rng.start}-${rng.end}@yaffotlv.com`,
      summary: "Blocked",
      start: rng.start,
      end: rng.end,
    })),
  ];

  const body = generateICalendar(events, { calName: "YaffoTLV Availability" });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="yaffotlv.ics"',
      // Short CDN cache — platforms re-fetch on their own (hourly-ish) anyway.
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}

/** Merge sorted YYYY-MM-DD nights into [start, endExclusive) ranges. */
function coalesceNights(dates: string[]): Array<{ start: string; end: string }> {
  const sorted = [...new Set(dates)].sort();
  const ranges: Array<{ start: string; end: string }> = [];
  for (const d of sorted) {
    const last = ranges[ranges.length - 1];
    if (last && last.end === d) {
      last.end = addDays(d, 1); // contiguous → extend
    } else {
      ranges.push({ start: d, end: addDays(d, 1) });
    }
  }
  return ranges;
}
