import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { spUsers, type SpUser } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SP_JWT_SECRET || "dev-secret-change-me-in-production"
);

export const SESSION_COOKIE = "sp_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: {
  userId: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (typeof payload.userId === "string" && typeof payload.email === "string") {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/** Issue a session cookie for the given user. Call from a Route Handler. */
export async function setSession(user: {
  id: string;
  email: string;
}): Promise<void> {
  const token = await createToken({ userId: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read and verify the current session from cookies. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Fetch the full user row for the current session, or null. */
export async function getCurrentUser(): Promise<SpUser | null> {
  const session = await getSession();
  if (!session) return null;
  const [user] = await db
    .select()
    .from(spUsers)
    .where(eq(spUsers.id, session.userId))
    .limit(1);
  return user ?? null;
}
