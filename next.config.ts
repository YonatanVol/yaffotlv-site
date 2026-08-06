import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Ad pixels are opt-in. Their origins are added to the CSP only when the
// corresponding ID is configured at build time, so the allowlist stays tight
// while the funnel ships dark.
const metaPixel = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);
const tiktokPixel = Boolean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
const pixelScript = [
  metaPixel ? "https://connect.facebook.net" : "",
  tiktokPixel ? "https://analytics.tiktok.com" : "",
].filter(Boolean).join(" ");
const pixelImg = [
  metaPixel ? "https://www.facebook.com" : "",
  tiktokPixel ? "https://analytics.tiktok.com" : "",
].filter(Boolean).join(" ");
const pixelConnect = [
  metaPixel ? "https://www.facebook.com https://connect.facebook.net" : "",
  tiktokPixel ? "https://analytics.tiktok.com" : "",
].filter(Boolean).join(" ");
const withPixels = (base: string, extra: string) => (extra ? `${base} ${extra}` : base);

// Content-Security-Policy scoped to the origins this site actually uses:
//  - CARTO basemap tiles (Leaflet)         → img/connect
//  - Leaflet CSS from unpkg                  → style (+ img for its referenced assets)
//  - Vercel Analytics beacon                 → same-origin /_vercel/insights/*
//  - Next.js inline bootstrap + framer-motion inline styles → 'unsafe-inline'
// Stripe Checkout is a full-page redirect (not embedded), so no Stripe origins are needed here.
const csp = [
  "default-src 'self'",
  // Next injects small inline bootstrap scripts; dev/HMR additionally needs eval.
  withPixels(`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, pixelScript),
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  // Vercel Blob hosts the owner-uploaded site photos (admin → Photos).
  withPixels(
    "img-src 'self' data: blob: https://*.basemaps.cartocdn.com https://unpkg.com https://*.public.blob.vercel-storage.com",
    pixelImg
  ),
  "font-src 'self' data:",
  withPixels("connect-src 'self' https://*.basemaps.cartocdn.com https://vitals.vercel-insights.com", pixelConnect),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Only force HTTPS upgrades in production (would break http://localhost in dev).
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // HSTS is meaningful only over HTTPS (Vercel) — omit in dev.
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  images: {
    // Owner-uploaded photos live in Vercel Blob; everything else is bundled locally.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
