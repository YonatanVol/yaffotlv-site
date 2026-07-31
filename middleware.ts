import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecretKey } from "@/lib/env";

const COOKIE_NAME = "admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin (except the login page) and the owner-only music mover API,
  // which holds the connected YouTube/Spotify tokens.
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isMusicApi = pathname.startsWith("/api/music");
  if (!isAdminPage && !isMusicApi) {
    return NextResponse.next();
  }

  // An API caller gets a status it can handle; a page gets the login form.
  const denied = () =>
    isMusicApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return denied();
  }

  try {
    await jwtVerify(token, getJwtSecretKey());
    return NextResponse.next();
  } catch {
    return denied();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/music/:path*"],
};
