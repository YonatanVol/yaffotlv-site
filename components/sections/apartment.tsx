"use client";

import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

// Placeholder description — shown until the owner pastes the real Airbnb write-up.
const FALLBACK_PARAGRAPHS = [
  "Newly renovated in 2024, this bright 3-room apartment sits in a quiet corner of Jaffa — two bedrooms, a comfortable living room, a fully equipped kitchen, and air conditioning in every room.",
  "Designed to feel like a home rather than a hotel: around 80 sqm of calm, natural light and thoughtful detail. It comfortably sleeps up to 8, with a baby cot available on request.",
  "You're a 10-minute walk from the beach and steps from the best of Tel Aviv — the Jaffa flea market, Abu Hasan, and countless cafés and restaurants right around the corner.",
];

export function Apartment() {
  const { t } = useI18n();
  const a = t.apartment;
  const paragraphs = a?.paragraphs && a.paragraphs.length ? a.paragraphs : FALLBACK_PARAGRAPHS;

  return (
    <section id="apartment" className="scroll-mt-24 bg-ivory py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {a?.overline || "The Apartment"}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
            {a?.title || "A home in the heart of Jaffa"}
          </h2>
        </Reveal>

        <Reveal className="mt-8 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-graphite">
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium uppercase tracking-[0.15em] text-stone">
          <span>2 bedrooms</span>
          <span className="text-sand">·</span>
          <span>5 beds</span>
          <span className="text-sand">·</span>
          <span>1.5 baths</span>
          <span className="text-sand">·</span>
          <span>~80 sqm</span>
          <span className="text-sand">·</span>
          <span>Sleeps 8</span>
        </Reveal>
      </div>
    </section>
  );
}
