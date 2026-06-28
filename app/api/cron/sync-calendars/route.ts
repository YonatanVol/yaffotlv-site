import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, safeEqual } from "@/lib/env";
import { runCalendarSync } from "@/lib/calendar-sync";

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
    const result = await runCalendarSync();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Calendar sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
