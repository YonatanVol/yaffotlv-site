import { ImportView } from "@/components/import-view";

export default async function ImportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.s === "string" ? sp.s : "";

  let urls: string[] = [];
  if (raw) {
    try {
      const decoded: unknown = JSON.parse(atob(raw));
      if (Array.isArray(decoded)) {
        urls = decoded
          .filter((u): u is string => typeof u === "string")
          .slice(0, 30);
      }
    } catch {
      // Malformed payload — proceed with empty list.
    }
  }

  return <ImportView initialUrls={urls} />;
}
