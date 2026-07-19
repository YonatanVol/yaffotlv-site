import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { sitePhotos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** Longest edge kept for site photos — plenty for a full-bleed hero on retina. */
const MAX_EDGE = 2400;
const MAX_BYTES = 4 * 1024 * 1024; // stay under the serverless body limit
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Photo storage is not configured yet — create a Blob store in Vercel." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Please upload a JPEG, PNG, WebP or AVIF image." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is too large. Please pick one under 4 MB." },
      { status: 413 }
    );
  }

  const slot = form.get("slot") === "hero" ? "hero" : "gallery";
  const alt = (form.get("alt") as string | null)?.slice(0, 300) ?? "";
  const label = (form.get("label") as string | null)?.slice(0, 100) || null;

  // Normalise: `.rotate()` with no argument bakes any EXIF orientation into the
  // pixels and drops the flag. Consumers that ignore EXIF (including Next's own
  // image optimizer) would otherwise render phone photos sideways.
  let processed: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const pipeline = sharp(input)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    processed = data;
    width = info.width;
    height = info.height;
  } catch {
    return NextResponse.json({ error: "That file could not be read as an image." }, { status: 422 });
  }

  const safeName = (file.name || "photo").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/\.[^.]+$/, "");
  const blob = await put(`site-photos/${safeName}.jpg`, processed, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: true,
  });

  // Imported here rather than at module scope: `lib/db` throws on load when
  // DATABASE_URL is absent, which would turn the 401/validation replies above
  // into a 500 before they were ever reached.
  const { db } = await import("@/lib/db");

  // New photos land at the end of their slot's order.
  const existing = await db.select({ id: sitePhotos.id }).from(sitePhotos);

  const [row] = await db
    .insert(sitePhotos)
    .values({
      url: blob.url,
      pathname: blob.pathname,
      alt,
      label,
      slot,
      sortOrder: existing.length,
      width,
      height,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/admin/photos");

  return NextResponse.json({ photo: row }, { status: 201 });
}
