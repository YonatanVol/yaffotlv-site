"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Sticker {
  id: string;
  processedUrl: string;
}

export function ImportView({ initialUrls }: { initialUrls: string[] }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);

  async function runImport() {
    setPhase("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stickers/import-urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: initialUrls }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 402) {
          setErrorMsg(body.error || "Monthly limit reached.");
          router.push(body.upgradeUrl || "/billing");
          return;
        }
        setErrorMsg(body.error || "Import failed. Try again.");
        setPhase("error");
        return;
      }
      setStickers(body.stickers ?? []);
      setTruncated(!!body.truncated);
      setPhase("done");
    } catch {
      setErrorMsg("Network error. Try again.");
      setPhase("error");
    }
  }

  // Auto-start if URLs were provided.
  useEffect(() => {
    if (initialUrls.length > 0) runImport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialUrls.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Import stickers</h1>
        <p className="text-sm text-slate-600">
          No sticker URLs were provided. Install the browser extension to capture
          stickers from your TikTok sticker drawer, then click &quot;Import to
          WhatsApp&quot; in the extension popup.
        </p>
        <Button variant="secondary" onClick={() => router.push("/extract")}>
          Go to extract page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Import from TikTok sticker drawer</h1>
        <p className="mt-1 text-sm text-slate-600">
          {phase === "loading"
            ? `Downloading and converting ${initialUrls.length} sticker${initialUrls.length !== 1 ? "s" : ""}…`
            : phase === "done"
            ? `${stickers.length} sticker${stickers.length !== 1 ? "s" : ""} imported and ready.`
            : `${initialUrls.length} sticker${initialUrls.length !== 1 ? "s" : ""} received from extension.`}
        </p>
      </div>

      {phase === "loading" && (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-6">
          <Spinner />
          <span className="text-sm text-slate-600">Processing stickers…</span>
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-3">
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </p>
          <Button onClick={runImport}>Retry</Button>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-4">
          {truncated && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Some stickers were skipped because of your monthly conversion limit.
            </p>
          )}
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
          <div className="flex gap-3">
            <Button onClick={() => router.push("/builder")}>Continue to builder</Button>
            <Button variant="secondary" onClick={() => router.push("/extract")}>
              Add more stickers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
