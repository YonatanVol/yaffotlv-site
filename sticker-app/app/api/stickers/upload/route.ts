import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { convertAndStoreSticker } from "@/lib/stickers";
import {
  getStickersConverted,
  limitForPlan,
  reserveStickerQuota,
} from "@/lib/usage";

export const maxDuration = 60;

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB per upload
const ACCEPTED = ["image/webp", "image/gif", "image/png", "image/jpeg", "image/apng"];

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
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

  const toProcess = files.slice(0, allowance);
  const stored = [];
  for (const file of toProcess) {
    if (file.size > MAX_FILE_BYTES) continue;
    if (file.type && !ACCEPTED.includes(file.type)) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const row = await convertAndStoreSticker({
      userId: user.id,
      buffer,
      source: "manual_upload",
      originalFormat: file.type || undefined,
    });
    if (row) stored.push(row);
  }

  if (stored.length > 0) {
    await reserveStickerQuota(user.id, user.plan, stored.length);
  }

  if (stored.length === 0) {
    return NextResponse.json(
      { error: "None of the uploaded files could be converted." },
      { status: 422 }
    );
  }

  return NextResponse.json({
    ok: true,
    stickers: stored,
    truncated: files.length > toProcess.length,
  });
}
