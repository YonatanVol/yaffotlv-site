"use client";

import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

export function Apartment() {
  const { t } = useI18n();
  const a = t.apartment;
  // These paragraphs used to be a hardcoded English array. Because no locale
  // defined `apartment.paragraphs`, every visitor — Hebrew, Arabic, Russian —
  // read the English text. They now live in translations like everything else.
  const paragraphs = a?.paragraphs ?? [];

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

        {/* Facts strip — driven by lib/facts.ts and the active locale, rather
            than the English literals that previously showed in every language. */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium uppercase tracking-[0.15em] text-stone">
          <span>{t.amenities.beds}</span>
          <span className="text-sand">·</span>
          <span>{t.amenities.bathrooms}</span>
          <span className="text-sand">·</span>
          {/* Localized ("80 מ״ר" in Hebrew), not a hardcoded "m²". */}
          <span>{t.amenities.size}</span>
          <span className="text-sand">·</span>
          <span>{t.amenities.guests}</span>
        </Reveal>
      </div>
    </section>
  );
}
