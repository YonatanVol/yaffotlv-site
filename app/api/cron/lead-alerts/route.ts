import { NextRequest, NextResponse } from "next/server";
import { getCronSecret, safeEqual } from "@/lib/env";
import { leads } from "@/lib/db/schema";
import { and, inArray, isNull, or, sql } from "drizzle-orm";
import { sendLeadAlert } from "@/lib/email";

/**
 * Hourly check for enquiries that left a contact detail.
 *
 * Sends nothing when there is nothing new, so an email in the inbox always
 * means a real enquiry. Rows are claimed by `alertedAt` rather than by a time
 * window: a run that is skipped or fails simply catches up on the next pass,
 * and a retry cannot alert the same lead twice.
 */
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

    const pending = await db
      .select()
      .from(leads)
      .where(
        and(
          isNull(leads.alertedAt),
          // Only worth an alert if we can actually reach them.
          or(sql`${leads.email} is not null`, sql`${leads.phone} is not null`)
        )
      )
      .limit(50);

    if (pending.length === 0) {
      return NextResponse.json({ ok: true, alerted: 0 });
    }

    await sendLeadAlert({
      leads: pending.map((l) => ({
        email: l.email,
        name: l.name,
        phone: l.phone,
        checkIn: l.checkIn,
        checkOut: l.checkOut,
        guests: l.guests,
        stage: l.stage,
      })),
    });

    // Marked only after the send succeeds — a failed send retries next hour.
    await db
      .update(leads)
      .set({ alertedAt: new Date() })
      .where(
        inArray(
          leads.id,
          pending.map((l) => l.id)
        )
      );

    return NextResponse.json({ ok: true, alerted: pending.length });
  } catch (error) {
    console.error("Lead alert error:", error);
    return NextResponse.json({ error: "Alert failed" }, { status: 500 });
  }
}
