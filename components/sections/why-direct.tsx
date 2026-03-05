"use client";

import { Reveal, RevealItem } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

export function WhyDirect() {
  const { t } = useI18n();

  const reasons = [
    {
      icon: "💰",
      title: t.whyDirect?.price || "Best Price Guaranteed",
      desc: t.whyDirect?.priceDesc || "Always 10% cheaper than Airbnb or Booking.com. No middleman, no extra fees.",
    },
    {
      icon: "💬",
      title: t.whyDirect?.contact || "Direct Communication",
      desc: t.whyDirect?.contactDesc || "Chat directly with your host on WhatsApp. Faster answers, personal recommendations.",
    },
    {
      icon: "🔄",
      title: t.whyDirect?.flexible || "Flexible & Easy",
      desc: t.whyDirect?.flexibleDesc || "Free cancellation up to 3 days before check-in. No hidden charges, no surprises.",
    },
    {
      icon: "🏠",
      title: t.whyDirect?.local || "Local Expertise",
      desc: t.whyDirect?.localDesc || "Get insider tips, restaurant picks, and a digital guide from someone who knows Jaffa best.",
    },
  ];

  return (
    <section className="bg-cream py-24">
      <Reveal className="mb-14 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.whyDirect?.overline || "Why Book Direct"}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.whyDirect?.title || "Skip the platforms. Book here."}
        </h2>
      </Reveal>

      <Reveal variant="stagger" className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 sm:grid-cols-2">
        {reasons.map((r, i) => (
          <RevealItem key={i}>
            <div className="flex gap-4">
              <span className="mt-1 text-2xl">{r.icon}</span>
              <div>
                <h3 className="text-base font-medium text-charcoal">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone">{r.desc}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
