import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blockedDates, calendarSyncLog } from "@/lib/db/schema";
import { fetchCalendar, expandEvents } from "@/lib/ical";
import { getCronSecret, safeEqual } from "@/lib/env";
import { inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Verify cron secret (constant-time; requires CRON_SECRET to be set).
  const authHeader = request.headers.get("authorization") || "";
  let expected: string;
  try {
    expected = `Bearer ${getCronSecret()}`;
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  if (!safeEqual(authHeader, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sources: Array<{ url: string; source: string }> = [];

    if (process.env.ICAL_AIRBNB_URL) {
      sources.push({ url: process.env.ICAL_AIRBNB_URL, source: "airbnb" });
    }
    if (process.env.ICAL_BOOKING_URL) {
      sources.push({ url: process.env.ICAL_BOOKING_URL, source: "booking_com" });
    }

    // Fetch all calendars in parallel
    const results = await Promise.allSettled(
      sources.map(async ({ url, source }) => {
        const events = await fetchCalendar(url);
        const expanded = expandEvents(events);
        return { source, dates: expanded };
      })
    );

    // Delete existing calendar-sourced blocked dates
    await db
      .delete(blockedDates)
      .where(inArray(blockedDates.source, ["airbnb", "booking_com"]));

    // Insert fresh blocked dates
    const allDates: Array<{
      date: string;
      source: string;
      externalUid: string;
      summary: string;
    }> = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        for (const d of result.value.dates) {
          allDates.push({
            date: d.date,
            source: result.value.source,
            externalUid: d.uid,
            summary: d.summary,
          });
        }
      } else {
        console.error("Calendar sync failed:", result.reason);
      }
    }

    if (allDates.length > 0) {
      // Insert in batches to avoid query size limits
      const BATCH_SIZE = 100;
      for (let i = 0; i < allDates.length; i += BATCH_SIZE) {
        await db.insert(blockedDates).values(allDates.slice(i, i + BATCH_SIZE));
      }
    }

    // Persist per-source result/count/timestamp (feeds the admin sync-status panel).
    const logRows = results.map((r, i) => ({
      source: sources[i].source,
      status: r.status === "fulfilled" ? ("success" as const) : ("error" as const),
      count: r.status === "fulfilled" ? r.value.dates.length : 0,
      message: r.status === "rejected" ? String(r.reason).slice(0, 500) : null,
    }));
    if (logRows.length > 0) {
      await db.insert(calendarSyncLog).values(logRows);
    }

    return NextResponse.json({
      synced: allDates.length,
      sources: results.map((r, i) => ({
        source: sources[i].source,
        status: r.status,
        count: r.status === "fulfilled" ? r.value.dates.length : 0,
      })),
    });
  } catch (error) {
    console.error("Calendar sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
