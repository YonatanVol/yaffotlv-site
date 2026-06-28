"use client";

import { useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Signature } from "@/components/sections/signature";
import { PhotoSlider } from "@/components/sections/photo-slider";
import { Navbar } from "@/components/sections/navbar";
import { ContactModal } from "@/components/sections/contact-modal";
import { Amenities } from "@/components/sections/amenities";
import { Sleeping } from "@/components/sections/sleeping";
import { Reviews } from "@/components/sections/reviews";
import { NeighborhoodMap } from "@/components/sections/neighborhood-map";
import { WhyDirect } from "@/components/sections/why-direct";
import { Host } from "@/components/sections/host";
import { PerfectFor } from "@/components/sections/perfect-for";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Navbar onContactClick={() => setContactOpen(true)} />

      <Hero />

      {/* Details bar — micro credibility */}
      <section className="border-b border-sand bg-ivory py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-xs font-medium uppercase tracking-[0.25em] text-stone">
          <span>{t.details.bedrooms}</span>
          <span className="text-sand">•</span>
          <span>{t.details.location}</span>
          <span className="text-sand">•</span>
          <span>{t.details.sea}</span>
          <span className="text-sand">•</span>
          <span>{t.details.vibe}</span>
        </div>
      </section>

      <Signature />

      {/* Breathing space — editorial quote */}
      <section className="bg-cream py-32">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-serif text-3xl font-light leading-relaxed text-charcoal md:text-4xl">
            {t.quote}
          </p>
        </Reveal>
      </section>

      <PhotoSlider />

      <Reviews />

      <Amenities />

      <Sleeping />

      <PerfectFor />

      <WhyDirect />

      <Host />

      <NeighborhoodMap />

      {/* Closing CTA */}
      <section id="contact" className="bg-ivory py-32">
        <Reveal className="mx-auto max-w-xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {t.cta.overline}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            {t.cta.headline}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            {t.cta.description}
          </p>

          {/* "Book Direct & Save" badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <span>💰</span>
            <span>{t.socialProof?.save || "Save 10% when you book direct"}</span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="inline-block bg-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-accent-dark"
            >
              {t.cta.bookNow}
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-block border border-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
            >
              {t.cta.contactUs}
            </button>
          </div>
        </Reveal>
      </section>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
