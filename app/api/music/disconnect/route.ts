import { NextRequest, NextResponse } from "next/server";
import { isProvider, requireAdmin } from "@/lib/music/api";
import { clearConnections } from "@/lib/music/session";

/**
 * Forgets the stored tokens for one provider (or both).
 *
 * This only clears them locally — access can also be revoked at the source, at
 * myaccount.google.com/permissions and spotify.com/account/apps.
 */
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as { provider?: string };
  if (body.provider && !isProvider(body.provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  await clearConnections(body.provider && isProvider(body.provider) ? body.provider : undefined);
  return NextResponse.json({ ok: true });
}
