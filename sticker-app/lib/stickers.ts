import { db } from "@/lib/db";
import { spStickers, type SpSticker } from "@/lib/db/schema";
import { convertToWhatsAppWebp, ConversionError } from "@/lib/conversion/image-pipeline";
import { uploadBlob } from "@/lib/storage/blob";

export interface StoreStickerInput {
  userId: string;
  buffer: Buffer;
  source: "tiktok_api" | "manual_upload";
  tiktokVideoId?: string;
  originalUrl?: string;
  originalFormat?: string;
}

/**
 * Convert a raw image into a WhatsApp WebP, upload it to Blob storage, and
 * persist a sticker row. Returns the row, or null if conversion failed.
 */
export async function convertAndStoreSticker(
  input: StoreStickerInput
): Promise<SpSticker | null> {
  let converted;
  try {
    converted = await convertToWhatsAppWebp(input.buffer);
  } catch (err) {
    if (err instanceof ConversionError) {
      console.warn("Sticker conversion skipped:", err.message);
      return null;
    }
    throw err;
  }

  const processedUrl = await uploadBlob(
    `stickers/${input.userId}/${Date.now()}.webp`,
    converted.buffer,
    "image/webp"
  );

  const [row] = await db
    .insert(spStickers)
    .values({
      userId: input.userId,
      source: input.source,
      tiktokVideoId: input.tiktokVideoId ?? null,
      originalUrl: input.originalUrl ?? null,
      originalFormat: input.originalFormat ?? null,
      processedUrl,
      isAnimated: converted.animated,
      fileSizeBytes: converted.sizeBytes,
    })
    .returning();

  return row;
}
