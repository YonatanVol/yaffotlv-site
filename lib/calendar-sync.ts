import { db } from "@/lib/db";
import { blockedDates, calendarSyncLog } from "@/lib/db/schema";
import { fetchCalendar, expandEvents } from "@/lib/ical";
import { alertHost } from "@/lib/alerts";
import { eq } from "drizzle-orm";

export interface SyncSourceResult {
  source: string;
  status: "success" | "error";
  count: number;
  message?: string | null;
}

export interface SyncResult {
  synced: number;
  sources: SyncSourceResult[];
}

const BATCH_SIZE = 100;

/**
 * Pull external calendars (Airbnb, Booking.com) and refresh their blocked dates.
 *
 * Resilient: each source is fetched independently and only a source that SUCCEEDS
 * has its blocks replaced — a transient failure on one platform leaves its
 * last-good blocks intact and never disturbs the other platform. Per-source
 * results are persisted to calendar_sync_log (feeds the admin sync-status panel).
 *
 * Shared by the cron route and the admin "sync now" action (no self-HTTP call).
 */
export async function runCalendarSync(): Promise<SyncResult> {
  const sources: Array<{ url: string; source: string }> = [];
  if (process.env.ICAL_AIRBNB_URL) sources.push({ url: process.env.ICAL_AIRBNB_URL, source: "airbnb" });
  if (process.env.ICAL_BOOKING_URL) sources.push({ url: process.env.ICAL_BOOKING_URL, source: "booking_com" });

  const results = await Promise.allSettled(
    sources.map(async ({ url, source }) => {
      const events = await fetchCalendar(url);
      return { source, dates: expandEvents(events) };
    })
  );

  let synced = 0;
  const summary: SyncSourceResult[] = [];

  for (let i = 0; i < results.length; i++) {
    const source = sources[i].source;
    const result = results[i];

    if (result.status === "fulfilled") {
      const rows = result.value.dates.map((d) => ({
        date: d.date,
        source,
        externalUid: d.uid,
        summary: d.summary,
      }));
      // Replace only this source's blocks (leave the other platform untouched).
      await db.delete(blockedDates).where(eq(blockedDates.source, source));
      for (let j = 0; j < rows.length; j += BATCH_SIZE) {
        await db.insert(blockedDates).values(rows.slice(j, j + BATCH_SIZE));
      }
      synced += rows.length;
      summary.push({ source, status: "success", count: rows.length, message: null });
    } else {
      // Leave existing blocks for this source in place; just record the failure.
      console.error(`Calendar sync failed for ${source}:`, result.reason);
      summary.push({ source, status: "error", count: 0, message: String(result.reason).slice(0, 500) });
      await alertHost(
        `Calendar sync failed: ${source}`,
        `The ${source} calendar pull failed. Its existing blocks were left intact.\n\n${String(result.reason).slice(0, 1000)}`
      );
    }
  }

  if (summary.length > 0) {
    await db.insert(calendarSyncLog).values(
      summary.map((s) => ({ source: s.source, status: s.status, count: s.count, message: s.message ?? null }))
    );
  }

  return { synced, sources: summary };
}
