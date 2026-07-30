"use client";

import { Reveal } from "@/components/ui/reveal";
import { GoldStars } from "@/components/ui/gold-stars";
import { ReviewCard } from "./review-card";
import { useI18n } from "@/lib/i18n/context";
import { reviews } from "@/lib/reviews-data";
import { HOST_STATS, hasVerifiedRating } from "@/lib/facts";

const AIRBNB_LISTING = "https://www.airbnb.com/rooms/39292240";

export function ReviewsAll() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      {/* Header */}
      <Reveal className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.reviews?.title || "Guest Reviews"}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
          {t.reviews?.subtitle || "What our guests say"}
        </h1>
        {/* Only with a real rating behind it — see lib/facts.ts. */}
        {hasVerifiedRating() && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <GoldStars size="lg" showLabel={true} />
            <span className="text-sm text-stone">
              · {HOST_STATS.reviewCount} {t.reviews?.reviewCount || "reviews"}
            </span>
          </div>
        )}
      </Reveal>

      {/* Verified-on-Airbnb card (static — links to the real listing) */}
      <Reveal className="mt-10">
        <a
          href={AIRBNB_LISTING}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-sm border border-sand bg-ivory p-6 text-center transition-shadow hover:shadow-md sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="text-sm font-medium text-charcoal">{t.reviews?.verified || "Verified on Airbnb"}</p>
            <p className="mt-1 text-xs text-stone">2 bedrooms · 5 beds · 1.5 baths</p>
          </div>
          <span className="inline-flex flex-shrink-0 items-center gap-2 text-sm font-medium text-accent">
            {t.reviews?.viewAll || "Read all reviews on Airbnb"} →
          </span>
        </a>
      </Reveal>

      {/* All reviews */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
