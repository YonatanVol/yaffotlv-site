"use client";

import { Reveal, RevealItem } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

export function PerfectFor() {
  const { t } = useI18n();

  const audiences = [
    {
      emoji: "👫",
      title: t.perfectFor?.couples || "Couples",
      desc: t.perfectFor?.couplesDesc || "Romantic sunsets from Old Jaffa Port, candlelit dinners at The Container, and morning walks on the beach.",
    },
    {
      emoji: "👨‍👩‍👧‍👦",
      title: t.perfectFor?.families || "Families",
      desc: t.perfectFor?.familiesDesc || "Spacious 3 rooms, crib available, pet-friendly, elevator, and the Flea Market is a 4-minute walk.",
    },
    {
      emoji: "💻",
      title: t.perfectFor?.remote || "Remote Workers",
      desc: t.perfectFor?.remoteDesc || "Fast WiFi, dedicated workspace, Nespresso machine, and quiet neighborhood. Stay productive, live beautifully.",
    },
    {
      emoji: "✈️",
      title: t.perfectFor?.travelers || "Explorers",
      desc: t.perfectFor?.travelersDesc || "Walk to Old Jaffa, light rail to Tel Aviv center in 15 min, Abu Hasan hummus 3 minutes away.",
    },
  ];

  return (
    <section className="bg-cream py-24">
      <Reveal className="mb-14 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.perfectFor?.overline || "Perfect For"}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.perfectFor?.title || "Who stays here"}
        </h2>
      </Reveal>

      <Reveal variant="stagger" className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        {audiences.map((a, i) => (
          <RevealItem key={i}>
            <div className="rounded-sm border border-sand/60 bg-ivory p-6 transition-shadow hover:shadow-sm">
              <span className="text-3xl">{a.emoji}</span>
              <h3 className="mt-3 text-base font-medium text-charcoal">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{a.desc}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
