import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Next.js 16 renamed the `middleware` convention to `proxy` (runs on the
// Node.js runtime). This guards the authenticated app pages.

const JWT_SECRET = new TextEncoder().encode(
  process.env.SP_JWT_SECRET || "dev-secret-change-me-in-production"
);
const SESSION_COOKIE = "sp_session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/extract",
  "/builder",
  "/download",
  "/billing",
  "/import",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  if (!token) return NextResponse.redirect(loginUrl);

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/extract/:path*",
    "/builder/:path*",
    "/download/:path*",
    "/billing/:path*",
    "/import/:path*",
  ],
};
