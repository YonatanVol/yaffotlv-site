import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { spPacks } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ packId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packId } = await ctx.params;

  const [pack] = await db
    .select()
    .from(spPacks)
    .where(and(eq(spPacks.id, packId), eq(spPacks.userId, user.id)))
    .limit(1);

  if (!pack || pack.status !== "ready" || !pack.downloadUrl) {
    return NextResponse.json({ error: "Pack not available." }, { status: 404 });
  }
  if (pack.expiresAt && new Date(pack.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: "This download link has expired. Rebuild the pack." },
      { status: 410 }
    );
  }

  const upstream = await fetch(pack.downloadUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Pack file missing." }, { status: 502 });
  }

  const safeName = pack.name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 60) || "pack";
  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}.wastickers"`,
    },
  });
}
