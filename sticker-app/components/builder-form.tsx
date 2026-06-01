"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const MIN = 3;
const MAX = 30;

interface StickerOption {
  id: string;
  processedUrl: string;
}

export function BuilderForm({
  stickers,
  defaultAuthor,
}: {
  stickers: StickerOption[];
  defaultAuthor: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState(defaultAuthor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX
          ? prev
          : [...prev, id]
    );
  }

  const valid = name.trim().length > 0 && selected.length >= MIN && selected.length <= MAX;

  async function build() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, author, stickerIds: selected }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Failed to build pack.");
        return;
      }
      router.push(`/download/${body.pack.id}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Pack name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My TikTok Pack"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Author</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Selected{" "}
          <span className={cn("font-semibold", valid ? "text-green-600" : "text-slate-900")}>
            {selected.length}
          </span>{" "}
          / {MAX} (min {MIN})
        </p>
        <Button onClick={build} disabled={!valid || loading}>
          {loading && <Spinner />}
          Build pack
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {stickers.map((s) => {
          const isSel = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              className={cn(
                "relative aspect-square rounded-lg border-2 bg-slate-50 p-1 transition-colors",
                isSel ? "border-indigo-600" : "border-slate-200 hover:border-slate-300"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.processedUrl}
                alt="sticker"
                className="h-full w-full object-contain"
              />
              {isSel && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
