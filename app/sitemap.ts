import type { MetadataRoute } from "next";

// Real "last modified" dates instead of `new Date()` (which made every route look
// freshly modified on every request). Bump LAST_CONTENT_UPDATE when site content
// meaningfully changes.
const LAST_CONTENT_UPDATE = new Date("2026-06-24");
const LEGAL_UPDATED = new Date("2026-06-24");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yaffotlv.com";

  return [
    { url: baseUrl, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/book`, lastModified: LAST_CONTENT_UPDATE, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/legal/terms`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/cancellation`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/house-rules`, lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];
}
