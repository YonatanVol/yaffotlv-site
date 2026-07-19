import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { activityLog } from "@/lib/db/schema";

/**
 * Salted hash of the caller IP. Keeps visitors distinguishable for counting
 * while storing something that is not itself an identifier. The salt lives in
 * the environment so the hashes cannot be reversed with a lookup table.
 */
function hashIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  const salt = process.env.IP_HASH_SALT ?? "yaffotlv-analytics";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, event, metadata } = body;

    if (!sessionId || !event) {
      return NextResponse.json({ error: "Missing sessionId or event" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const forwarded = request.headers.get("x-forwarded-for");
    const rawIp = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
    // Vercel resolves the visitor's country at the edge.
    const country = request.headers.get("x-vercel-ip-country") || undefined;

    // Promoted out of the JSON blob so the weekly report can aggregate in SQL.
    const meta = (metadata ?? {}) as Record<string, unknown>;
    const path = typeof meta.page === "string" ? meta.page : undefined;
    const referrer = typeof meta.referrer === "string" ? meta.referrer : undefined;

    const { db } = await import("@/lib/db");
    await db.insert(activityLog).values({
      sessionId,
      event,
      metadata: metadata ? JSON.stringify(metadata) : null,
      path,
      referrer,
      country,
      userAgent,
      ip: hashIp(rawIp),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Activity tracking error:", error);
    // Never fail the client — tracking is non-critical
    return NextResponse.json({ ok: true });
  }
}
