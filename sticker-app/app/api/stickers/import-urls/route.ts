import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertAndStoreSticker } from "@/lib/stickers";
import { getStickersConverted, limitForPlan, reserveStickerQuota } from "@/lib/usage";

export const maxDuration = 60;

const ALLOWED_CDN = /^https:\/\/[\w-]+-stickers\.tiktokcdn\.com\//;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: "urls[] required" }, { status: 400 });
  }

  // Only accept TikTok sticker CDN URLs — reject anything else.
  const urls: string[] = (body.urls as unknown[])
    .filter((u): u is string => typeof u === "string" && ALLOWED_CDN.test(u))
    .slice(0, 30);

  if (urls.length === 0) {
    return NextResponse.json({ error: "No valid TikTok sticker URLs provided." }, { status: 400 });
  }

  const used = await getStickersConverted(user.id);
  const limit = limitForPlan(user.plan);
  const allowance = limit - used;
  if (allowance <= 0) {
    return NextResponse.json(
      { error: "Monthly conversion limit reached.", upgradeUrl: "/billing" },
      { status: 402 }
    );
  }

  const toProcess = urls.slice(0, allowance);
  const stored = [];

  for (const url of toProcess) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") ?? "image/webp";
      if (!contentType.startsWith("image/")) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      const row = await convertAndStoreSticker({
        userId: user.id,
        buffer,
        source: "manual_upload",
        originalFormat: contentType,
      });
      if (row) stored.push(row);
    } catch {
      // Skip URLs that fail to fetch or convert.
    }
  }

  if (stored.length > 0) {
    await reserveStickerQuota(user.id, user.plan, stored.length);
  }

  if (stored.length === 0) {
    return NextResponse.json(
      { error: "None of the sticker URLs could be downloaded or converted." },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    stickers: stored,
    truncated: urls.length > allowance,
  });
}
