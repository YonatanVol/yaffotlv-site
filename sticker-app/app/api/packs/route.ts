import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { spPacks, spStickers } from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import {
  buildStickerPack,
  MAX_STICKERS,
  MIN_STICKERS,
} from "@/lib/conversion/pack-builder";
import { uploadBlob } from "@/lib/storage/blob";
import { incrementPacksCreated } from "@/lib/usage";

export const maxDuration = 60;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const packs = await db
    .select()
    .from(spPacks)
    .where(eq(spPacks.userId, user.id))
    .orderBy(desc(spPacks.createdAt));

  return NextResponse.json({ packs });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { name, author, stickerIds } = body as {
    name?: string;
    author?: string;
    stickerIds?: string[];
  };

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Pack name is required." }, { status: 400 });
  }
  if (
    !Array.isArray(stickerIds) ||
    stickerIds.length < MIN_STICKERS ||
    stickerIds.length > MAX_STICKERS
  ) {
    return NextResponse.json(
      { error: `Select between ${MIN_STICKERS} and ${MAX_STICKERS} stickers.` },
      { status: 400 }
    );
  }

  // Load the user's stickers, then re-order them to match stickerIds.
  const rows = await db
    .select()
    .from(spStickers)
    .where(and(eq(spStickers.userId, user.id), inArray(spStickers.id, stickerIds)));

  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = stickerIds.map((id) => byId.get(id)).filter((r) => r != null);
  if (ordered.length !== stickerIds.length) {
    return NextResponse.json(
      { error: "Some selected stickers were not found." },
      { status: 400 }
    );
  }

  const publisher = (author && author.trim()) || "StickerPack";
  const [pack] = await db
    .insert(spPacks)
    .values({
      userId: user.id,
      name: name.trim(),
      publisher,
      status: "building",
      stickerCount: ordered.length,
    })
    .returning();

  try {
    // Pull the converted WebP bytes back from Blob storage.
    const buffers = await Promise.all(
      ordered.map(async (s) => {
        const res = await fetch(s!.processedUrl);
        if (!res.ok) throw new Error(`Failed to fetch sticker ${s!.id}`);
        return Buffer.from(await res.arrayBuffer());
      })
    );

    const { zip, trayIcon } = await buildStickerPack({
      title: name.trim(),
      author: publisher,
      stickers: buffers,
    });

    const [downloadUrl, trayIconUrl] = await Promise.all([
      uploadBlob(`packs/${pack.id}.wastickers`, zip, "application/zip"),
      uploadBlob(`packs/${pack.id}-tray.webp`, trayIcon, "image/webp"),
    ]);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [updated] = await db
      .update(spPacks)
      .set({
        status: "ready",
        downloadUrl,
        trayIconUrl,
        builtAt: new Date(),
        expiresAt,
      })
      .where(eq(spPacks.id, pack.id))
      .returning();

    // Attach stickers to the pack with their order.
    await Promise.all(
      ordered.map((s, i) =>
        db
          .update(spStickers)
          .set({ packId: pack.id, positionInPack: i })
          .where(eq(spStickers.id, s!.id))
      )
    );

    await incrementPacksCreated(user.id);
    return NextResponse.json({ pack: updated });
  } catch (err) {
    console.error("Pack build failed:", err);
    await db
      .update(spPacks)
      .set({
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Build failed",
      })
      .where(eq(spPacks.id, pack.id));
    return NextResponse.json(
      { error: "Failed to build the sticker pack." },
      { status: 500 }
    );
  }
}
