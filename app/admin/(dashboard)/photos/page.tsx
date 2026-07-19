import { getPhotos } from "@/app/admin/photos-actions";
import { PhotoManager } from "@/components/admin/photo-manager";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const photos = await getPhotos();
  const storageReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-light text-graphite">Photos</h1>
        <p className="mt-2 text-sm text-stone">
          Upload photos and choose what appears on the site. Changes go live immediately — no deploy needed.
        </p>
      </header>

      {!storageReady && (
        <div className="mb-6 rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong className="font-medium">Photo storage isn&apos;t set up yet.</strong>
          <p className="mt-1">
            In Vercel go to <em>Storage → Create Database → Blob</em>, connect it to this project, then redeploy.
            Uploading stays disabled until then; the site keeps using its built-in photos.
          </p>
        </div>
      )}

      <PhotoManager initialPhotos={photos} storageReady={storageReady} />
    </div>
  );
}
