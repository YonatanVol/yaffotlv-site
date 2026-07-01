"use client";

import { GoldStars } from "@/components/ui/gold-stars";
import { useI18n } from "@/lib/i18n/context";
import type { Review } from "@/lib/reviews-data";

export function ReviewCard({ review }: { review: Review }) {
  const { locale } = useI18n();

  return (
    <div className="flex h-full flex-col rounded-sm border border-sand/60 bg-ivory p-6">
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

      <div className="mt-3">
        <GoldStars size="sm" showLabel={false} />
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">{review.text}</p>

      <p className="mt-4 text-xs text-stone">
        {new Date(review.date + "-01").toLocaleDateString(
          locale === "he" ? "he-IL" : locale === "ar" ? "ar-SA" : locale,
          { year: "numeric", month: "long" }
        )}
      </p>
    </div>
  );
}
