import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blockedDates, reservations } from "@/lib/db/schema";
import { todayJerusalem, addDays, dateRange } from "@/lib/dates";
import { gte, lte, and, inArray } from "drizzle-orm";

export const revalidate = 60;

export async function GET() {
  try {
    const today = todayJerusalem();
    const maxDate = addDays(today, 365);

    // Get all blocked dates
    const blocked = await db
      .select({ date: blockedDates.date })
      .from(blockedDates)
      .where(and(gte(blockedDates.date, today), lte(blockedDates.date, maxDate)));

    // Get confirmed/pending reservations and expand to individual dates
    const active = await db
      .select({ checkIn: reservations.checkIn, checkOut: reservations.checkOut })
      .from(reservations)
      .where(inArray(reservations.status, ["confirmed", "pending_payment", "draft"]));

    const blockedSet = new Set(blocked.map((b) => b.date));
    for (const res of active) {
      for (const d of dateRange(res.checkIn, res.checkOut)) {
        blockedSet.add(d);
      }
    }

    return NextResponse.json({
      blockedDates: Array.from(blockedSet).sort(),
      rangeStart: today,
      rangeEnd: maxDate,
    });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ blockedDates: [], rangeStart: todayJerusalem(), rangeEnd: addDays(todayJerusalem(), 365) });
  }
}
