import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy scoped to the origins this site actually uses:
//  - CARTO basemap tiles (Leaflet)         → img/connect
//  - Leaflet CSS from unpkg                  → style (+ img for its referenced assets)
//  - Vercel Analytics beacon                 → same-origin /_vercel/insights/*
//  - Next.js inline bootstrap + framer-motion inline styles → 'unsafe-inline'
// Stripe Checkout is a full-page redirect (not embedded), so no Stripe origins are needed here.
const csp = [
  "default-src 'self'",
  // Next injects small inline bootstrap scripts; dev/HMR additionally needs eval.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  // Vercel Blob hosts the owner-uploaded site photos (admin → Photos); the
  // ytimg/scdn hosts are the video and album thumbnails in admin → Music.
  "img-src 'self' data: blob: https://*.basemaps.cartocdn.com https://unpkg.com https://*.public.blob.vercel-storage.com https://*.ytimg.com https://*.scdn.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.basemaps.cartocdn.com https://vitals.vercel-insights.com",
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
    // Owner-uploaded photos live in Vercel Blob; everything else is bundled
    // locally. The admin music mover renders YouTube/Spotify thumbnails
    // unoptimized (they are transient previews, not worth the transform quota).
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.ytimg.com" },
      { protocol: "https", hostname: "*.scdn.co" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
