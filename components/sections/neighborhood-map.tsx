"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";
import { pois, APARTMENT_LOCATION, categoryLabels } from "@/lib/map-data";
import type { POICategory } from "@/lib/map-data";
import type { Locale } from "@/lib/i18n/translations";

// Dynamically import map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

function MapInner({ locale }: { locale: string }) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const lang = (locale === "he" || locale === "ar" ? "he" : "en") as "en" | "he";

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
    // Inject leaflet CSS via link tag
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  if (!L) return <div className="h-[400px] animate-pulse bg-sand/30 rounded-sm" />;

  const createIcon = (emoji: string, isApartment: boolean) =>
    L.divIcon({
      html: `<div style="font-size:${isApartment ? "28px" : "22px"};text-align:center;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">${emoji}</div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  return (
    <MapContainer
      center={[APARTMENT_LOCATION.lat, APARTMENT_LOCATION.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "2px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={createIcon(poi.emoji, poi.category === "apartment")}
        >
          <Popup>
            <div className="text-center min-w-[140px]">
              <p className="font-semibold text-sm">{poi.name[lang]}</p>
              {poi.description && (
                <p className="text-xs text-gray-600 mt-1">{poi.description[lang]}</p>
              )}
              {poi.walkingMinutes > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  🚶 {poi.walkingMinutes} min walk
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function NeighborhoodMap() {
  const { t, locale } = useI18n();
  const lang = (locale === "he" || locale === "ar" ? "he" : "en") as "en" | "he";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Group POIs by category (excluding apartment)
  const categories = Object.keys(categoryLabels).filter(
    (c) => c !== "apartment"
  ) as POICategory[];

  return (
    <section className="bg-ivory py-24">
      <Reveal className="mb-12 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.map?.title || "The Neighborhood"}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.map?.subtitle || "Explore Jaffa"}
        </h2>
      </Reveal>

      <div className="mx-auto max-w-5xl px-6">
        {/* Map */}
        {mounted && <MapInner locale={locale} />}

        {/* POI Legend */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => {
            const categoryPois = pois.filter((p) => p.category === cat);
            if (categoryPois.length === 0) return null;
            return (
              <div key={cat} className="rounded-sm border border-sand/60 bg-cream/50 p-4">
                <p className="text-sm font-medium text-charcoal mb-2">
                  {categoryLabels[cat].emoji} {categoryLabels[cat][lang]}
                </p>
                {categoryPois.map((poi) => (
                  <p key={poi.id} className="text-xs text-stone leading-relaxed">
                    {poi.name[lang]} · {poi.walkingMinutes} min
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
