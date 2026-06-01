import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spPacks } from "@/lib/db/schema";
import { and, eq, lt, isNotNull } from "drizzle-orm";
import { deleteBlob } from "@/lib/storage/blob";

// Daily cleanup of expired pack downloads. Configure in Vercel cron (see README).
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const expired = await db
    .select()
    .from(spPacks)
    .where(
      and(
        eq(spPacks.status, "ready"),
        isNotNull(spPacks.expiresAt),
        lt(spPacks.expiresAt, now)
      )
    );

  for (const pack of expired) {
    if (pack.downloadUrl) await deleteBlob(pack.downloadUrl);
    if (pack.trayIconUrl) await deleteBlob(pack.trayIconUrl);
    // Drop the expired pack row; stickers keep their rows (packId set null).
    await db.delete(spPacks).where(eq(spPacks.id, pack.id));
  }

  return NextResponse.json({ cleaned: expired.length });
}
