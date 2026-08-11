"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { GoldStars } from "@/components/ui/gold-stars";
import { ReviewCard } from "./review-card";
import { useI18n } from "@/lib/i18n/context";
import type { SiteReviews } from "@/lib/google-reviews";

export function Reviews({ siteReviews }: { siteReviews: SiteReviews }) {
  const { reviews, rating, total } = siteReviews;
  const { t } = useI18n();
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
    <section id="reviews" className="bg-cream py-24">
      <Reveal className="mb-12 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.reviews?.title || "Guest Reviews"}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.reviews?.subtitle || "What our guests say"}
        </h2>
        {/* Real Google rating, or nothing at all — never an invented number. */}
        {rating && total && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <GoldStars size="lg" showLabel={false} />
            <span className="text-sm text-stone">
              {rating} · {total} {t.reviews?.reviewCount || "reviews"}
            </span>
          </div>
        )}
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
            className="min-w-[300px] max-w-[360px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* See all reviews → dedicated page */}
      <div className="mt-8 text-center">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          {t.reviews?.seeAll || "See all reviews"} →
        </Link>
      </div>
    </section>
  );
}
