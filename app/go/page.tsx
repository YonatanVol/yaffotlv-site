import type { Metadata } from "next";
import { getHeroPhoto } from "@/lib/photos";
import { getActiveRule } from "@/lib/pricing-data";
import { LandingContent } from "@/components/landing/landing-content";

/**
 * The Instagram / TikTok bio link.
 *
 * A campaign destination, not a page for search engines — it deliberately
 * duplicates the homepage's selling points in a shorter, vertical, one-thumb
 * format, so it is `noindex` and stays out of the sitemap.
 *
 * Deliberately excludes framer-motion and Leaflet, which the homepage pulls in:
 * this is opened from an in-app browser on mobile data, and every kilobyte is a
 * chance to lose the visit.
 */
export const metadata: Metadata = {
  // `absolute` avoids the root template turning this into "YaffoTLV | YaffoTLV".
  title: { absolute: "YaffoTLV — דירה ביפו" },
  description: "A 3-room apartment in Jaffa, Tel Aviv — book direct and save 10%.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

// Availability and pricing change; don't serve a stale price from the CDN.
export const revalidate = 3600;

export default async function GoPage() {
  const [photo, rule] = await Promise.all([getHeroPhoto(), getActiveRule().catch(() => null)]);

  // A real number from the pricing engine, so an ad never promises a price the
  // booking page then contradicts. Agorot → shekels.
  const fromPrice = rule?.baseRateNight ? Math.round(rule.baseRateNight / 100) : null;

  return <LandingContent photo={photo} fromPrice={fromPrice} />;
}
