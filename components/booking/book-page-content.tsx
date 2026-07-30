"use client";

import { BookingWidget } from "@/components/booking/booking-widget";
import { SecurityBadges } from "@/components/ui/security-badges";
import { useI18n } from "@/lib/i18n/context";

export function BookPageContent() {
  const { t } = useI18n();

  return (
    <>
      <section className="bg-ink pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            {t.book.overline}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-white md:text-6xl">
            {t.book.title}
          </h1>
          <p className="mt-4 text-lg text-white/60">
            {t.book.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-cream py-16">
        <BookingWidget />
      </section>

      {/* Extra bottom padding so the fixed social-proof bar (bottom-24) and the
          WhatsApp button can't sit on top of the badges at the end of the page. */}
      <section className="bg-ivory pt-12 pb-40">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-sm text-stone">
            {t.book.cancellation}
          </p>
          <SecurityBadges className="mt-6" />
        </div>
      </section>
    </>
  );
}
