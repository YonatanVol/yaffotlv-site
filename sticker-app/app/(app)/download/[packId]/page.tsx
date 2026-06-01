import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { spPacks, spStickers } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { DownloadView } from "@/components/download-view";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ packId: string }>;
}) {
  const { packId } = await params;
  const user = (await getCurrentUser())!;

  const [pack] = await db
    .select()
    .from(spPacks)
    .where(and(eq(spPacks.id, packId), eq(spPacks.userId, user.id)))
    .limit(1);

  if (!pack) notFound();

  const stickers = await db
    .select({ id: spStickers.id, processedUrl: spStickers.processedUrl })
    .from(spStickers)
    .where(eq(spStickers.packId, packId))
    .orderBy(asc(spStickers.positionInPack));

  return (
    <DownloadView
      packId={pack.id}
      name={pack.name}
      status={pack.status}
      stickers={stickers}
    />
  );
}
