import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { spStickers } from "@/lib/db/schema";
import { and, desc, eq, isNull } from "drizzle-orm";
import { BuilderForm } from "@/components/builder-form";

export default async function BuilderPage() {
  const user = (await getCurrentUser())!;

  // Stickers the user has converted but not yet assigned to a pack.
  const stickers = await db
    .select({ id: spStickers.id, processedUrl: spStickers.processedUrl })
    .from(spStickers)
    .where(and(eq(spStickers.userId, user.id), isNull(spStickers.packId)))
    .orderBy(desc(spStickers.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Build your pack</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pick 3–30 stickers, name your pack, and we&apos;ll package it for WhatsApp.
        </p>
      </div>

      {stickers.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-600">
          You don&apos;t have any unused stickers yet.{" "}
          <Link href="/extract" className="font-semibold text-indigo-600">
            Add some first.
          </Link>
        </p>
      ) : (
        <BuilderForm
          stickers={stickers}
          defaultAuthor={user.name || "StickerPack"}
        />
      )}
    </div>
  );
}
