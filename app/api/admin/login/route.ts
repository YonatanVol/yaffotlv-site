import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession, COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminLoginAttempts } from "@/lib/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

// Per-IP throttle: 5 failed attempts within the window → locked out for the window.
const MAX_FAILED = 5;
const WINDOW_MINUTES = 15;

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  try {
    // --- Rate limit / lockout (per IP, sliding window) ---
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
    const [failRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(adminLoginAttempts)
      .where(
        and(
          eq(adminLoginAttempts.ip, ip),
          eq(adminLoginAttempts.success, false),
          gte(adminLoginAttempts.createdAt, windowStart)
        )
      );
    const recentFailures = Number(failRow?.count ?? 0);

    if (recentFailures >= MAX_FAILED) {
      // Generic — never reveal whether a password was close, or even valid.
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(WINDOW_MINUTES * 60) } }
      );
    }

    const body = await request.json().catch(() => null);
    const password = body?.password;
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const valid = await verifyPassword(password);

    // Record this attempt (used by the throttle above on the next request).
    await db.insert(adminLoginAttempts).values({ ip, success: valid });

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // On success, clear this IP's recent failures so the counter resets.
    await db
      .delete(adminLoginAttempts)
      .where(and(eq(adminLoginAttempts.ip, ip), eq(adminLoginAttempts.success, false)));

    const token = await createSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
