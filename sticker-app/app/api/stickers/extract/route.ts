import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { extractStickersFromUrl } from "@/lib/tiktok/api-fetcher";
import { convertAndStoreSticker } from "@/lib/stickers";
import {
  getStickersConverted,
  limitForPlan,
  reserveStickerQuota,
} from "@/lib/usage";

// Converting a batch of animated stickers can take a while.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json().catch(() => ({}));
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "A TikTok URL is required." }, { status: 400 });
  }

  // Quota gate before doing any expensive work.
  const used = await getStickersConverted(user.id);
  const limit = limitForPlan(user.plan);
  const allowance = limit - used;
  if (allowance <= 0) {
    return NextResponse.json(
      { error: "Monthly conversion limit reached.", upgradeUrl: "/billing" },
      { status: 402 }
    );
  }

  const result = await extractStickersFromUrl(url);
  if (!result.ok) {
    // Not an error the client should retry — surface the reason so the UI can
    // prompt manual upload.
    return NextResponse.json(
      { ok: false, reason: result.reason, message: result.message, stickers: [] },
      { status: 200 }
    );
  }

  const toProcess = result.stickers.slice(0, allowance);
  const stored = [];
  for (const raw of toProcess) {
    const row = await convertAndStoreSticker({
      userId: user.id,
      buffer: raw.buffer,
      source: "tiktok_api",
      tiktokVideoId: result.videoId,
      originalUrl: raw.url,
      originalFormat: raw.format,
    });
    if (row) stored.push(row);
  }

  if (stored.length > 0) {
    await reserveStickerQuota(user.id, user.plan, stored.length);
  }

  return NextResponse.json({
    ok: true,
    stickers: stored,
    truncated: result.stickers.length > toProcess.length,
  });
}
