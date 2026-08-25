import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/music/api";
import { clearConnections } from "@/lib/music/session";

/**
 * Forgets the stored tokens for one provider, or for both when no provider is
 * named.
 *
 * This only clears them locally — access can also be revoked at the source, at
 * myaccount.google.com/permissions and spotify.com/account/apps.
 */
const schema = z.object({ provider: z.enum(["google", "spotify"]).optional() });

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  // Parsed strictly: a malformed body must not fall through to "clear
  // everything". Only a well-formed object with no provider means both.
  const body: unknown = await request.json().catch(() => undefined);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await clearConnections(parsed.data.provider);
  return NextResponse.json({ ok: true });
}
