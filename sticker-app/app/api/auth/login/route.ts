import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, setSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await db
      .select()
      .from(spUsers)
      .where(eq(spUsers.email, normalizedEmail))
      .limit(1);

    // Generic message to avoid leaking which emails exist.
    const invalid = NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
    if (!user) return invalid;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return invalid;

    await setSession({ id: user.id, email: user.email });
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Could not log in." }, { status: 500 });
  }
}
