import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations, blockedDates } from "@/lib/db/schema";
import { eq, and, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find expired drafts
    const expired = await db
      .select({ id: reservations.id })
      .from(reservations)
      .where(
        and(
          eq(reservations.status, "draft"),
          lte(reservations.expiresAt, new Date())
        )
      );

    for (const { id } of expired) {
      await db.update(reservations).set({ status: "expired" }).where(eq(reservations.id, id));
      await db.delete(blockedDates).where(eq(blockedDates.externalUid, id));
    }

    return NextResponse.json({ expired: expired.length });
  } catch (error) {
    console.error("Expire drafts error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
