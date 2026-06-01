"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Platform = "android" | "ios" | "other";

interface StickerOption {
  id: string;
  processedUrl: string;
}

export function DownloadView({
  packId,
  name,
  status,
  stickers,
}: {
  packId: string;
  name: string;
  status: string;
  stickers: StickerOption[];
}) {
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
  }, []);

  if (status !== "ready") {
    return (
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-600">
          This pack is {status}. {status === "error" && "Please rebuild it."}
        </p>
        <Link href="/builder" className="mt-4 inline-block">
          <Button variant="secondary">Back to builder</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {stickers.length} stickers · ready to install
        </p>
      </div>

      {/* Android */}
      <section
        className={
          platform === "ios" ? "opacity-50" : "rounded-2xl border border-slate-200 p-6"
        }
      >
        <h2 className="font-semibold">📱 Android</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>Tap the button below to download the pack file.</li>
          <li>Open it — Android will offer to add it to WhatsApp.</li>
          <li>Tap “Add to WhatsApp”. Done!</li>
        </ol>
        <a href={`/api/packs/${packId}/download`} className="mt-4 inline-block">
          <Button>Download .wastickers</Button>
        </a>
      </section>

      {/* iOS */}
      <section className="rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold">🍏 iPhone / iPad</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>
            Install the free{" "}
            <a
              href="https://apps.apple.com/app/sticker-ly/id1458740623"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-600"
            >
              Sticker.ly
            </a>{" "}
            app.
          </li>
          <li>Long-press each sticker below and save the image.</li>
          <li>In Sticker.ly, create a pack and import the saved images.</li>
          <li>Tap “Add to WhatsApp” inside Sticker.ly.</li>
        </ol>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {stickers.map((s, i) => (
            <a
              key={s.id}
              href={s.processedUrl}
              download={`${i + 1}.webp`}
              target="_blank"
              rel="noreferrer"
              className="aspect-square rounded-lg border border-slate-200 bg-slate-50 p-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.processedUrl}
                alt={`sticker ${i + 1}`}
                className="h-full w-full object-contain"
              />
            </a>
          ))}
        </div>
      </section>

      <Link href="/dashboard" className="inline-block text-sm font-medium text-indigo-600">
        ← Back to dashboard
      </Link>
    </div>
  );
}
