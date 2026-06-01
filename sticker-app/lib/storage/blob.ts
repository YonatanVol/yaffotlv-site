import { put, del } from "@vercel/blob";

/**
 * Upload a buffer to Vercel Blob and return its public URL.
 * Requires BLOB_READ_WRITE_TOKEN in the environment.
 */
export async function uploadBlob(
  pathname: string,
  data: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const { url } = await put(pathname, Buffer.from(data), {
    access: "public",
    contentType,
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

/** Best-effort delete of a blob by URL. Never throws. */
export async function deleteBlob(url: string): Promise<void> {
  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (err) {
    console.error("Failed to delete blob:", url, err);
  }
}
