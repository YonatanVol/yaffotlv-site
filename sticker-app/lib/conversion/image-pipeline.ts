import sharp from "sharp";

const STATIC_MAX_BYTES = 100 * 1024; // WhatsApp: 100KB static
const ANIMATED_MAX_BYTES = 500 * 1024; // WhatsApp: 500KB animated
const QUALITY_STEPS = [80, 70, 60, 50, 40];

export interface ConvertedSticker {
  buffer: Buffer;
  width: number;
  height: number;
  animated: boolean;
  sizeBytes: number;
}

export class ConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConversionError";
  }
}

/** Detect an APNG by scanning for the `acTL` chunk before the first `IDAT`. */
function isApng(buf: Buffer): boolean {
  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  if (!buf.subarray(0, 4).equals(pngSig)) return false;
  const actl = buf.indexOf("acTL");
  const idat = buf.indexOf("IDAT");
  return actl !== -1 && (idat === -1 || actl < idat);
}

/**
 * Convert any supported input (WebP, GIF, APNG, PNG, JPEG) into a
 * WhatsApp-compatible 512x512 WebP. Animated inputs preserve animation;
 * APNG falls back to its first frame (documented limitation).
 */
export async function convertToWhatsAppWebp(
  input: Buffer
): Promise<ConvertedSticker> {
  const apng = isApng(input);
  let meta: sharp.Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch (err) {
    throw new ConversionError(
      `Unreadable image: ${err instanceof Error ? err.message : "unknown"}`
    );
  }

  // sharp cannot reassemble APNG animation, so treat it as a single frame.
  const animated = !apng && (meta.pages ?? 1) > 1;
  const maxBytes = animated ? ANIMATED_MAX_BYTES : STATIC_MAX_BYTES;

  const base = sharp(input, { animated }).resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  for (const quality of QUALITY_STEPS) {
    const buffer = await base
      .clone()
      .webp({ quality, loop: 0, effort: 4 })
      .toBuffer();
    if (buffer.length <= maxBytes) {
      return {
        buffer,
        width: 512,
        height: 512,
        animated,
        sizeBytes: buffer.length,
      };
    }
  }

  throw new ConversionError(
    `Sticker could not be compressed under ${Math.round(maxBytes / 1024)}KB ` +
      `(${animated ? "animated" : "static"}). Try a simpler image.`
  );
}
