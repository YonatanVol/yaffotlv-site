import JSZip from "jszip";
import { buildTrayIcon } from "./tray-icon";

export interface PackBuildInput {
  title: string;
  author: string;
  /** Already-converted 512x512 WebP sticker buffers, in pack order. */
  stickers: Buffer[];
}

export interface PackBuildResult {
  zip: Buffer;
  trayIcon: Buffer;
}

export const MIN_STICKERS = 3;
export const MAX_STICKERS = 30;

/**
 * Assemble a `.wastickers` ZIP: contents.json + tray.webp + NN.webp files.
 * The tray icon is generated from the first sticker.
 */
export async function buildStickerPack(
  input: PackBuildInput
): Promise<PackBuildResult> {
  const { title, author, stickers } = input;

  if (stickers.length < MIN_STICKERS || stickers.length > MAX_STICKERS) {
    throw new Error(
      `A pack must contain between ${MIN_STICKERS} and ${MAX_STICKERS} stickers (got ${stickers.length}).`
    );
  }

  const trayIcon = await buildTrayIcon(stickers[0]);

  const zip = new JSZip();
  zip.file("tray.webp", trayIcon);

  const contents: Record<string, string> = {
    title,
    author,
    tray_image: "tray.webp",
    android_play_store_link: "",
    ios_app_store_link: "",
  };

  stickers.forEach((buf, i) => {
    const filename = `${String(i + 1).padStart(2, "0")}.webp`;
    zip.file(filename, buf);
    contents[`sticker_file_${i}`] = filename;
  });

  zip.file("contents.json", JSON.stringify(contents, null, 2));

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return { zip: zipBuffer, trayIcon };
}
