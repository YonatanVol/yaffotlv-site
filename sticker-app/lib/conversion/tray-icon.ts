import sharp from "sharp";

/**
 * Build a 96x96 static WebP tray icon for a WhatsApp pack from the first
 * sticker's bytes. Always uses the first frame (tray icons are static).
 */
export async function buildTrayIcon(stickerBuffer: Buffer): Promise<Buffer> {
  return sharp(stickerBuffer, { pages: 1 })
    .resize(96, 96, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 80 })
    .toBuffer();
}
