"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { track } from "@/lib/analytics";
import { currentAttribution } from "@/lib/attribution";
import type { SitePhotoView } from "@/lib/photos";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972528701670";

/**
 * Mobile-first campaign page. One screen, one decision: check dates or message
 * on WhatsApp. Everything else is supporting evidence.
 */
export function LandingContent({
  photo,
  fromPrice,
}: {
  photo: SitePhotoView;
  fromPrice: number | null;
}) {
  const { t, locale, setLocale, isRtl } = useI18n();
  const l = t.landing;

  useEffect(() => {
    // Capture the campaign parameters before anything navigates away — the
    // query string is gone by the time the guest reaches /book.
    currentAttribution();
    track("page_view", { page: "/go", referrer: document.referrer || undefined });

    // This link is advertised to an Israeli audience, so default to Hebrew —
    // but never override a language the visitor has already chosen.
    if (!localStorage.getItem("yaffotlv-locale")) setLocale("he");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t.whatsapp?.message || "Hi, I'm interested in the apartment in Jaffa 🏡"
  )}`;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-cream pb-28">
      {/* Vertical hero — 4:5 is the shape Reels and TikTok viewers arrive from. */}
      <section className="relative aspect-[4/5] w-full overflow-hidden bg-ink sm:aspect-[16/10]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h1 className="font-serif text-3xl font-light leading-tight sm:text-4xl">{l.headline}</h1>
          <p className="mt-2 text-sm text-white/80">{l.sub}</p>
          {fromPrice !== null && (
            <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              {l.fromPrice.replace("{price}", String(fromPrice))}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-md px-6 py-8">
        <ul className="space-y-3">
          {l.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-graphite">
              <span className="mt-1 text-accent" aria-hidden="true">
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          onClick={() => track("gallery_opened", { from: "/go" })}
          className="mt-8 block text-center text-sm text-stone underline underline-offset-4 hover:text-accent"
        >
          {l.seeMore}
        </Link>
      </section>

      {/* Sticky actions — always one thumb away. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 p-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md gap-3">
          <Link
            href="/book"
            onClick={() => track("book_started", { from: "/go" })}
            className="flex-1 bg-accent px-4 py-3.5 text-center text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-dark"
          >
            {l.checkDates}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_clicked", { from: "/go" })}
            className="flex flex-1 items-center justify-center gap-2 border border-accent px-4 py-3.5 text-center text-xs font-medium uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {l.whatsapp}
          </a>
        </div>
      </div>
    </main>
  );
}
