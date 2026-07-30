import { sitePhotos } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import type { Translations } from "@/lib/i18n/translations";

// `lib/db` calls neon() at module scope and throws when DATABASE_URL is absent,
// so it is imported lazily *inside* the try blocks below. A static import would
// throw during module evaluation — before any catch could run — and take the
// whole homepage down over photos.
const getDb = async () => (await import("@/lib/db")).db;

export type RoomKey = keyof Translations["slider"]["rooms"];

export interface SitePhotoView {
  id: string;
  src: string;
  alt: string;
  /** Free-text caption set in the admin. */
  label: string | null;
  /** Only set on the bundled defaults, so their captions stay translated. */
  labelKey: RoomKey | null;
}

/**
 * Bundled defaults. These ship with the repo and are used whenever the
 * `site_photos` table is empty or unreachable, so the public site always has
 * photos even before the owner uploads any (or if the DB is down).
 */
const FALLBACK_HERO: SitePhotoView = {
  id: "fallback-hero",
  src: "/images/livingroom-hero.jpg",
  alt: "Bright living room with panoramic Jaffa view",
  label: null,
  labelKey: null,
};

const FALLBACK_GALLERY: SitePhotoView[] = [
  { id: "f1", src: "/images/livingroom1.jpg", alt: "Bright living room with panoramic Jaffa view", label: null, labelKey: "livingRoom" },
  { id: "f2", src: "/images/gallery-2.jpg", alt: "Modern kitchen and dining area", label: null, labelKey: "kitchen" },
  { id: "f3", src: "/images/gallery-1.jpg", alt: "Master bedroom", label: null, labelKey: "bedroom1" },
  { id: "f4", src: "/images/gallery-4.jpg", alt: "Second bedroom with warm tones", label: null, labelKey: "bedroom2" },
  { id: "f5", src: "/images/gallery-3.jpg", alt: "Elegant apartment entryway", label: null, labelKey: "entryway" },
];

function toView(row: typeof sitePhotos.$inferSelect): SitePhotoView {
  return { id: row.id, src: row.url, alt: row.alt, label: row.label, labelKey: null };
}

/** The homepage background. Falls back to the bundled hero image. */
export async function getHeroPhoto(): Promise<SitePhotoView> {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(sitePhotos)
      .where(and(eq(sitePhotos.slot, "hero"), eq(sitePhotos.isVisible, true)))
      .orderBy(asc(sitePhotos.sortOrder))
      .limit(1);
    return rows.length ? toView(rows[0]) : FALLBACK_HERO;
  } catch {
    // No DATABASE_URL, table missing, or DB unreachable — never break the page.
    return FALLBACK_HERO;
  }
}

/** Visible gallery photos in the owner's chosen order. Falls back to the bundled set. */
export async function getGalleryPhotos(): Promise<SitePhotoView[]> {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(sitePhotos)
      .where(and(eq(sitePhotos.slot, "gallery"), eq(sitePhotos.isVisible, true)))
      .orderBy(asc(sitePhotos.sortOrder));
    return rows.length ? rows.map(toView) : FALLBACK_GALLERY;
  } catch {
    return FALLBACK_GALLERY;
  }
}
