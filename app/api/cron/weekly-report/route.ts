import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, safeEqual } from "@/lib/env";
import { activityLog, leads } from "@/lib/db/schema";
import { and, gte, lt, sql } from "drizzle-orm";
import { sendWeeklyReport } from "@/lib/email";

/** Strip a referrer down to its host so the report groups by source, not URL. */
const HOST = sql<string>`coalesce(nullif(split_part(split_part(replace(replace(${activityLog.referrer}, 'https://', ''), 'http://', ''), '/', 1), 'www.', 2), ''), split_part(replace(replace(${activityLog.referrer}, 'https://', ''), 'http://', ''), '/', 1))`;

export async function GET(request: NextRequest) {
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
    const { db } = await import("@/lib/db");
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const window = and(gte(activityLog.createdAt, weekAgo), lt(activityLog.createdAt, now));

    const [totals] = await db
      .select({
        visits: sql<number>`count(*) filter (where ${activityLog.event} = 'page_view')::int`,
        uniqueVisitors: sql<number>`count(distinct ${activityLog.sessionId})::int`,
        bookingsStarted: sql<number>`count(*) filter (where ${activityLog.event} = 'book_started')::int`,
        bookingsCompleted: sql<number>`count(*) filter (where ${activityLog.event} = 'book_completed')::int`,
      })
      .from(activityLog)
      .where(window);

    const topReferrers = await db
      .select({ source: HOST, count: sql<number>`count(*)::int` })
      .from(activityLog)
      .where(and(window, sql`${activityLog.referrer} is not null and ${activityLog.referrer} <> ''`))
      .groupBy(HOST)
      .orderBy(sql`count(*) desc`)
      .limit(8);

    const topPages = await db
      .select({ path: activityLog.path, count: sql<number>`count(*)::int` })
      .from(activityLog)
      .where(and(window, sql`${activityLog.path} is not null`))
      .groupBy(activityLog.path)
      .orderBy(sql`count(*) desc`)
      .limit(8);

    const [leadTotals] = await db
      .select({ newLeads: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo));

    await sendWeeklyReport({
      from: weekAgo.toISOString().slice(0, 10),
      to: now.toISOString().slice(0, 10),
      visits: totals?.visits ?? 0,
      uniqueVisitors: totals?.uniqueVisitors ?? 0,
      bookingsStarted: totals?.bookingsStarted ?? 0,
      bookingsCompleted: totals?.bookingsCompleted ?? 0,
      newLeads: leadTotals?.newLeads ?? 0,
      topReferrers: topReferrers.map((r) => ({ source: r.source || "direct", count: r.count })),
      topPages: topPages.map((p) => ({ path: p.path || "/", count: p.count })),
    });

    return NextResponse.json({ ok: true, visits: totals?.visits ?? 0 });
  } catch (error) {
    console.error("Weekly report error:", error);
    return NextResponse.json({ error: "Report failed" }, { status: 500 });
  }
}
