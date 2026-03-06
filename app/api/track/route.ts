import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, event, metadata } = body;

    if (!sessionId || !event) {
      return NextResponse.json({ error: "Missing sessionId or event" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;

    await db.insert(activityLog).values({
      sessionId,
      event,
      metadata: metadata ? JSON.stringify(metadata) : null,
      userAgent,
      ip,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Activity tracking error:", error);
    // Never fail the client — tracking is non-critical
    return NextResponse.json({ ok: true });
  }
}
