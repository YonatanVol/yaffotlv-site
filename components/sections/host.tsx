"use client";

import { Reveal } from "@/components/ui/reveal";
import { GoldStars } from "@/components/ui/gold-stars";
import { useI18n } from "@/lib/i18n/context";

export function Host() {
  const { t } = useI18n();

  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {t.host?.overline || "Your Host"}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
            {t.host?.title || "Meet Eitan"}
          </h2>
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
          {/* Host avatar */}
          <div className="flex flex-shrink-0 flex-col items-center gap-3">
            {/* TODO(host-photo): drop a real square photo at /public/images/host.jpg
                (≥ 400×400, rendered at 96px) and replace this placeholder with:
                <img src="/images/host.jpg" alt="Eitan" width={96} height={96}
                     className="h-24 w-24 rounded-full object-cover" /> */}
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sand/60 text-stone/70">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-charcoal">Eitan</p>
              <p className="text-xs text-stone">{t.host?.superhost || "Superhost"}</p>
            </div>
          </div>

          {/* Host info */}
          <div className="text-center md:text-left">
            <p className="text-base leading-relaxed text-graphite">
              {t.host?.bio || "Born and raised in Jaffa, I've been hosting guests for over 12 years. I renovated this apartment in 2024 with one goal: to make you feel at home, not in a hotel. I'm always a WhatsApp message away if you need anything — restaurant tips, directions, or just a friendly recommendation."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2 text-sm text-stone">
                <GoldStars size="sm" showLabel={false} />
                <span>· 140+ {t.reviews?.reviewCount || "reviews"}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-stone">
                🏆 {t.host?.yearsHosting || "12 years hosting"}
              </div>
              <div className="flex items-center gap-1 text-sm text-stone">
                ⚡ {t.host?.responseTime || "Responds in 1 hour"}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
