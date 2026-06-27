"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatILS } from "@/lib/pricing";
import type { PriceQuote } from "@/lib/pricing";
import { useI18n } from "@/lib/i18n/context";

interface PriceBreakdownProps {
  quote: PriceQuote | null;
  loading: boolean;
}

export function PriceBreakdown({ quote, loading }: PriceBreakdownProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="mt-8 animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-sand" />
        <div className="h-4 w-48 rounded bg-sand" />
        <div className="h-4 w-44 rounded bg-sand" />
        <div className="h-6 w-40 rounded bg-sand" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {quote && (
        <motion.div
          key={`${quote.checkIn}-${quote.checkOut}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border border-sand bg-ivory p-6"
        >
          {/* Deal badge — surfaces whatever discount applied (promo / last-minute / long-stay) */}
          {quote.discountAmount > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-sm bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              <span aria-hidden>🎉</span>
              <span>
                {quote.discountLabel} · −{formatILS(quote.discountAmount)} ILS
              </span>
            </div>
          )}

          {/* Header */}
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t.book.total}
          </p>

          {/* Nightly breakdown */}
          <div className="mt-4 space-y-2">
            {quote.nightlyBreakdown.map((night, index) => (
              <motion.div
                key={night.date}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-graphite">
                  {night.dayName}, {night.date}
                </span>
                <span className="font-mono text-sm text-charcoal tabular-nums">
                  {formatILS(night.rate)} ILS
                </span>
              </motion.div>
            ))}
          </div>

          {/* Subtotal before VAT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-4 border-t border-sand pt-4 space-y-2"
          >
            {quote.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700">{t.book.discount || "Discount"}</span>
                <span className="font-mono text-sm text-green-700 tabular-nums">
                  −{formatILS(quote.discountAmount)} ILS
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-stone">{t.book.cleaning}</span>
              <span className="font-mono text-sm text-stone tabular-nums">
                {formatILS(quote.cleaningFee)} ILS
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-graphite">{t.book.subtotal}</span>
              <span className="font-mono text-sm text-charcoal tabular-nums">
                {formatILS(quote.totalBeforeVat)} ILS
              </span>
            </div>

            {/* VAT line */}
            <div className="flex justify-between text-sm">
              <span className="text-stone">
                {t.book.vat || "VAT (18%)"}
              </span>
              <span className="font-mono text-sm text-stone tabular-nums">
                {formatILS(quote.vatAmount)} ILS
              </span>
            </div>
          </motion.div>

          {/* Total with VAT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 border-t border-accent/20 pt-4"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.1em] text-graphite">
                {t.book.total}
              </span>
              <span className="font-serif text-2xl font-light text-charcoal">
                {formatILS(quote.totalAmount)} ILS
              </span>
            </div>
            <p className="mt-1 text-xs text-stone text-end">
              {t.book.inclVat || "Price includes VAT"}
            </p>
          </motion.div>

          <p className="mt-4 text-xs text-stone">
            {t.book.cancellation}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
