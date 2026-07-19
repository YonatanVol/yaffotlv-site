"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  deletePhoto,
  movePhoto,
  setHeroPhoto,
  setPhotoVisibility,
  updatePhotoDetails,
} from "@/app/admin/photos-actions";

interface Photo {
  id: string;
  url: string;
  alt: string;
  label: string | null;
  slot: "hero" | "gallery" | "host";
  sortOrder: number;
  isVisible: boolean;
}

const MAX_EDGE = 2400;

/**
 * Shrink and re-encode in the browser before uploading.
 *
 * `imageOrientation: "from-image"` applies the EXIF rotation flag while drawing,
 * and re-encoding through a canvas drops the metadata — so phone photos arrive
 * upright. It also keeps the payload well under the serverless body limit,
 * which raw phone photos routinely exceed.
 */
async function prepareForUpload(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Encode failed"))), "image/jpeg", 0.86)
  );
}

export function PhotoManager({
  initialPhotos,
  storageReady,
}: {
  initialPhotos: Photo[];
  storageReady: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const photos = initialPhotos;
  const hero = photos.find((p) => p.slot === "hero");
  const gallery = photos.filter((p) => p.slot === "gallery").sort((a, b) => a.sortOrder - b.sortOrder);

  const refresh = () => startTransition(() => router.refresh());

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} of ${files.length}…`);
        const prepared = await prepareForUpload(files[i]);
        const body = new FormData();
        body.append("file", new File([prepared], files[i].name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        const res = await fetch("/api/admin/photos/upload", { method: "POST", body });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Upload failed (${res.status})`);
        }
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const run = (fn: () => Promise<void>) => async () => {
    setError(null);
    setBusy(true);
    try {
      await fn();
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const working = busy || isPending;

  return (
    <div className={working ? "pointer-events-none opacity-60" : undefined}>
      {/* Upload */}
      <section className="mb-8 rounded-sm border border-sand bg-ivory p-6">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          disabled={!storageReady}
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm text-stone file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-graphite file:px-4 file:py-2 file:text-xs file:font-medium file:uppercase file:tracking-[0.15em] file:text-white hover:file:bg-brass disabled:opacity-50"
        />
        <p className="mt-2 text-xs text-stone">
          Photos are straightened and resized automatically. You can select several at once.
        </p>
        {progress && <p className="mt-2 text-xs font-medium text-brass">{progress}</p>}
      </section>

      {error && (
        <p className="mb-6 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {/* Hero */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-stone">Main photo</h2>
        {hero ? (
          <PhotoCard photo={hero} isHero onAction={run} canMove={false} />
        ) : (
          <p className="rounded-sm border border-dashed border-sand p-6 text-sm text-stone">
            No main photo chosen — the site is using its built-in one. Upload a photo, then press
            &ldquo;Make main photo&rdquo;.
          </p>
        )}
      </section>

      {/* Gallery */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-stone">
          Gallery &amp; slider ({gallery.length})
        </h2>
        {gallery.length === 0 ? (
          <p className="rounded-sm border border-dashed border-sand p-6 text-sm text-stone">
            No photos yet — the site is showing its built-in gallery.
          </p>
        ) : (
          <div className="space-y-3">
            {gallery.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onAction={run}
                canMove
                isFirst={i === 0}
                isLast={i === gallery.length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PhotoCard({
  photo,
  isHero = false,
  canMove,
  isFirst,
  isLast,
  onAction,
}: {
  photo: Photo;
  isHero?: boolean;
  canMove: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onAction: (fn: () => Promise<void>) => () => Promise<void>;
}) {
  const [alt, setAlt] = useState(photo.alt);
  const [label, setLabel] = useState(photo.label ?? "");
  const dirty = alt !== photo.alt || label !== (photo.label ?? "");

  return (
    <div className="flex gap-4 rounded-sm border border-sand bg-white p-3">
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-sm bg-sand">
        <Image src={photo.url} alt={photo.alt || "Site photo"} fill sizes="128px" className="object-cover" />
        {!photo.isVisible && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px] font-medium uppercase tracking-wider text-stone">
            Hidden
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone">
              Caption
            </span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Living Room"
              className="w-full rounded-sm border border-sand px-2 py-1.5 text-sm focus:border-brass focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-stone">
              Description (for Google &amp; screen readers)
            </span>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Bright living room with sea view"
              className="w-full rounded-sm border border-sand px-2 py-1.5 text-sm focus:border-brass focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {dirty && (
            <Btn onClick={onAction(async () => updatePhotoDetails(photo.id, { alt, label: label || null }))} primary>
              Save
            </Btn>
          )}
          {!isHero && (
            <Btn onClick={onAction(async () => setHeroPhoto(photo.id))}>Make main photo</Btn>
          )}
          <Btn onClick={onAction(async () => setPhotoVisibility(photo.id, !photo.isVisible))}>
            {photo.isVisible ? "Hide" : "Show"}
          </Btn>
          {canMove && (
            <>
              <Btn onClick={onAction(async () => movePhoto(photo.id, "up"))} disabled={isFirst}>
                ↑
              </Btn>
              <Btn onClick={onAction(async () => movePhoto(photo.id, "down"))} disabled={isLast}>
                ↓
              </Btn>
            </>
          )}
          <Btn
            danger
            onClick={onAction(async () => {
              if (!confirm("Delete this photo? This cannot be undone.")) return;
              await deletePhoto(photo.id);
            })}
          >
            Delete
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
  primary,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  const tone = primary
    ? "bg-graphite text-white hover:bg-brass"
    : danger
      ? "border border-red-200 text-red-600 hover:bg-red-50"
      : "border border-sand text-graphite hover:border-brass hover:text-brass";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tone}`}
    >
      {children}
    </button>
  );
}
