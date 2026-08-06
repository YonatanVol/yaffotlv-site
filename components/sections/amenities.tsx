"use client";

import { useI18n } from "@/lib/i18n/context";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { PROPERTY } from "@/lib/facts";

const AMENITY_ICONS: Record<string, string> = {
  size: "📐",
  beds: "🛏️",
  bathrooms: "🚿",
  guests: "👥",
  renovated: "✨",
  checkin: "🔑",
  wifi: "📶",
  ac: "❄️",
  tv: "📺",
  streaming: "🎬",
  kitchen: "🍳",
  nespresso: "☕",
  washer: "👕",
  parking: "🅿️",
  workspace: "💻",
  elevator: "🏢",
  pets: "🐾",
  shelter: "🛡️",
  beach: "🏖️",
};

const AMENITY_KEYS = [
  "size", "beds", "bathrooms", "guests", "renovated", "checkin",
  "wifi", "ac", "tv", "streaming", "kitchen", "nespresso", "washer",
  "parking", "workspace", "elevator", "pets", "shelter", "beach",
] as const;

export function Amenities() {
  const { t } = useI18n();

  return (
    <section className="bg-ivory py-24">
      <Reveal className="mb-16 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.amenities.title}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.amenities.subtitle}
        </h2>
      </Reveal>

      <Reveal variant="stagger" className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {AMENITY_KEYS.map((key) => (
            <RevealItem key={key}>
              <div className="flex flex-col items-center gap-2 rounded-sm border border-sand/60 bg-cream/50 px-3 py-5 text-center transition-colors hover:border-accent/30 hover:bg-cream">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {AMENITY_ICONS[key]}
                </span>
                <span className="text-xs font-medium leading-tight text-graphite">
                  {t.amenities[key as keyof typeof t.amenities]}
                </span>
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>

      {/* Quick facts strip — measurable facts only. The stars, "Superhost" and
          "140+ reviews" that used to sit here were never verified. */}
      <div className="mx-auto mt-16 max-w-4xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-sand pt-8">
          <Fact label={t.book.checkIn} value={PROPERTY.checkInFrom} />
          <Fact label={t.book.checkOut} value={PROPERTY.checkOutBy} />
          <Fact label={t.amenities.size} value={`${PROPERTY.sizeSqm} m²`} />
          <Fact label={t.amenities.renovated} value={String(PROPERTY.renovatedYear)} />
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-serif font-light text-charcoal">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone">{label}</p>
    </div>
  );
}
