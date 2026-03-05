"use client";

import { useRef, useState, useEffect } from "react";
import { Reveal } from "@/components/ui/reveal";
import { useI18n } from "@/lib/i18n/context";
import { reviews } from "@/lib/reviews-data";
import type { Locale } from "@/lib/i18n/translations";

export function Reviews() {
  const { t, locale } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-cream py-24">
      <Reveal className="mb-12 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.reviews?.title || "Guest Reviews"}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.reviews?.subtitle || "What our guests say"}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-2xl text-accent">★</span>
          <span className="text-xl font-serif font-light text-charcoal">4.71</span>
          <span className="text-sm text-stone">· 140+ {t.reviews?.reviewCount || "reviews"}</span>
        </div>
      </Reveal>

      {/* Scrollable reviews */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto px-6 pb-4 scrollbar-hide md:px-12"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="min-w-[300px] max-w-[360px] flex-shrink-0 rounded-sm border border-sand/60 bg-ivory p-6 transition-shadow hover:shadow-md"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{review.countryFlag}</span>
                <span className="text-sm font-medium text-charcoal">{review.guestName}</span>
              </div>
              <span className="rounded bg-sand/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone">
                {review.source === "airbnb" ? "Airbnb" : "Booking.com"}
              </span>
            </div>

            {/* Stars */}
            <div className="mt-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < review.rating ? "text-accent" : "text-sand"}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            <p className="mt-3 text-sm leading-relaxed text-graphite">
              {review.text[locale as Locale] || review.text.en}
            </p>

            {/* Date */}
            <p className="mt-4 text-xs text-stone">
              {new Date(review.date + "-01").toLocaleDateString(locale === "he" ? "he-IL" : locale === "ar" ? "ar-SA" : locale, {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-8 text-center">
        <a
          href="https://www.airbnb.com/h/yaffotlv"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          {t.reviews?.viewAll || "View all reviews on Airbnb"} →
        </a>
      </div>
    </section>
  );
}
