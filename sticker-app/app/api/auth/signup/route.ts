import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { spUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: spUsers.id })
      .from(spUsers)
      .where(eq(spUsers.email, normalizedEmail))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(spUsers)
      .values({
        email: normalizedEmail,
        passwordHash,
        name: typeof name === "string" ? name.trim() || null : null,
      })
      .returning({ id: spUsers.id, email: spUsers.email });

    await setSession(user);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 }
    );
  }
}
