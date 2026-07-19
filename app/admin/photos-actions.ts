"use server";

import { db } from "@/lib/db";
import { sitePhotos } from "@/lib/db/schema";
import { asc, eq, ne } from "drizzle-orm";
import { del } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function requireAdmin() {
  if (!(await getSession())) throw new Error("Unauthorized");
}

/** Refresh both the public homepage and the admin screen after a change. */
function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/photos");
}

export async function getPhotos() {
  await requireAdmin();
  try {
    return await db.select().from(sitePhotos).orderBy(asc(sitePhotos.slot), asc(sitePhotos.sortOrder));
  } catch {
    // Migration not applied yet — show an empty manager rather than crashing.
    return [];
  }
}

const detailsSchema = z.object({
  alt: z.string().max(300),
  label: z.string().max(100).nullable(),
});

export async function updatePhotoDetails(id: string, input: { alt: string; label: string | null }) {
  await requireAdmin();
  const parsed = detailsSchema.parse(input);
  await db
    .update(sitePhotos)
    .set({ alt: parsed.alt, label: parsed.label?.trim() || null })
    .where(eq(sitePhotos.id, id));
  revalidate();
}

export async function setPhotoVisibility(id: string, isVisible: boolean) {
  await requireAdmin();
  await db.update(sitePhotos).set({ isVisible }).where(eq(sitePhotos.id, id));
  revalidate();
}

/**
 * Promote one photo to the homepage background. Any previous hero is demoted
 * back to the gallery, so exactly one hero exists without needing a DB constraint.
 */
export async function setHeroPhoto(id: string) {
  await requireAdmin();
  await db.update(sitePhotos).set({ slot: "gallery" }).where(ne(sitePhotos.id, id));
  await db.update(sitePhotos).set({ slot: "hero", isVisible: true }).where(eq(sitePhotos.id, id));
  revalidate();
}

/** Move a gallery photo one position earlier/later by swapping sort orders. */
export async function movePhoto(id: string, direction: "up" | "down") {
  await requireAdmin();
  const gallery = await db
    .select()
    .from(sitePhotos)
    .where(eq(sitePhotos.slot, "gallery"))
    .orderBy(asc(sitePhotos.sortOrder));

  const index = gallery.findIndex((p) => p.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= gallery.length) return;

  // Rewrite the whole run so orders stay contiguous even if they drifted.
  const reordered = [...gallery];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await Promise.all(
    reordered.map((p, i) => db.update(sitePhotos).set({ sortOrder: i }).where(eq(sitePhotos.id, p.id)))
  );
  revalidate();
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(sitePhotos).where(eq(sitePhotos.id, id)).limit(1);
  if (!row) return;

  // Remove the stored object first; if that fails we keep the row so the photo
  // isn't orphaned in Blob storage with no way to find it again.
  try {
    await del(row.url);
  } catch {
    // Already gone (or storage unreachable) — fall through and clear the row.
  }
  await db.delete(sitePhotos).where(eq(sitePhotos.id, id));
  revalidate();
}
