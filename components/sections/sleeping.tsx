"use client";

import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

export function Sleeping() {
  const { t } = useI18n();
  const s = t.sleeping;

  const beds = [
    { label: s?.bedroom || "Bedroom", detail: s?.doubleBed || "Double bed" },
    { label: s?.bedroom || "Bedroom", detail: s?.doubleBed || "Double bed" },
    {
      label: s?.living || "Living room",
      detail: s?.livingBeds || "Double sofa-bed, a sofa & a folding single bed",
    },
  ];

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {s?.overline || "The Space"}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
            {s?.title || "Comfortably sleeps up to 8"}
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {beds.map((b, i) => (
            <div key={i} className="border border-sand bg-ivory p-6 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">{b.label}</p>
              <p className="mt-3 text-base text-graphite">{b.detail}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 space-y-2 text-center">
          <p className="text-sm text-stone">{s?.cot || "Baby cot available on request"}</p>
          <p className="text-sm text-stone">
            {s?.parking || "Free street parking 19:00–09:00; paid during the day (~₪6/hr via the Cello app)."}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
