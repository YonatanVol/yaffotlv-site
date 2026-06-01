"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Sticker {
  id: string;
  processedUrl: string;
}

export default function ExtractPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleResponseError(status: number, body: { error?: string; upgradeUrl?: string }) {
    if (status === 402) {
      setError(body.error || "Monthly limit reached.");
      if (body.upgradeUrl) router.push(body.upgradeUrl);
      return true;
    }
    if (!body || status >= 500) {
      setError(body?.error || "Something went wrong. Try again.");
      return true;
    }
    return false;
  }

  async function extract(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/stickers/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (handleResponseError(res.status, body)) return;
        setError(body.error || "Extraction failed.");
        return;
      }
      if (!body.ok) {
        // Structured TikTok failure → offer manual upload.
        setNotice(body.message || "Couldn't read stickers from that link.");
        setShowUpload(true);
        return;
      }
      setStickers((prev) => [...prev, ...body.stickers]);
      if (body.truncated) {
        setNotice("Some stickers were skipped because of your monthly limit.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(files: FileList) {
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      const res = await fetch("/api/stickers/upload", { method: "POST", body: form });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (handleResponseError(res.status, body)) return;
        setError(body.error || "Upload failed.");
        return;
      }
      setStickers((prev) => [...prev, ...body.stickers]);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Add stickers</h1>
        <p className="mt-1 text-sm text-slate-600">
          Paste a public TikTok video URL, or upload sticker images directly.
        </p>
      </div>

      {/* URL extraction */}
      <form onSubmit={extract} className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.tiktok.com/@user/video/..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <Button type="submit" disabled={loading || !url.trim()}>
          {loading && <Spinner />}
          Extract
        </Button>
      </form>

      {notice && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Browser extension */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <h2 className="font-semibold text-indigo-900">Import from your TikTok sticker drawer</h2>
        <p className="mt-1 text-sm text-indigo-700">
          Install the StickerPack browser extension, open TikTok, tap the sticker button in
          a comment reply, then click <strong>Import to WhatsApp</strong> in the extension
          popup. Your stickers will land here automatically.
        </p>
        <p className="mt-2 text-xs text-indigo-500">
          Extension folder: <code>sticker-app/extension/</code> — load as an unpacked
          extension in Chrome › Extensions › Developer mode.
        </p>
      </div>

      {/* Manual upload */}
      <div>
        <button
          type="button"
          onClick={() => setShowUpload((v) => !v)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {showUpload ? "Hide manual upload" : "Or upload sticker images instead"}
        </button>
        {showUpload && (
          <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
            <input
              ref={fileInput}
              type="file"
              accept="image/webp,image/gif,image/png,image/jpeg,image/apng"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && upload(e.target.files)}
            />
            <p className="text-sm text-slate-600">
              WebP, GIF, APNG, PNG or JPEG — up to 10MB each.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              disabled={loading}
              onClick={() => fileInput.current?.click()}
            >
              Choose files
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {stickers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{stickers.length} sticker(s) ready</h2>
            <Button onClick={() => router.push("/builder")}>
              Continue to builder
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {stickers.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.id}
                src={s.processedUrl}
                alt="sticker"
                className="aspect-square w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
