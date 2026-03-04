"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatILS } from "@/lib/pricing";
import type { PriceQuote } from "@/lib/pricing";

interface PriceBreakdownProps {
  quote: PriceQuote | null;
  loading: boolean;
}

export function PriceBreakdown({ quote, loading }: PriceBreakdownProps) {
  if (loading) {
    return (
      <div className="mt-8 animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-sand" />
        <div className="h-4 w-48 rounded bg-sand" />
        <div className="h-6 w-40 rounded bg-sand" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {quote && (
        <motion.div
          key={`${quote.checkIn}-${quote.checkOut}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 border border-sand bg-ivory p-6"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Price Breakdown
          </p>

          <div className="mt-4 space-y-2">
            {quote.nightlyBreakdown.map((night) => (
              <div
                key={night.date}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-graphite">
                  {night.dayName}, {night.date}
                </span>
                <span className="text-charcoal">
                  {formatILS(night.rate)} ILS
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-sand pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-graphite">
                Subtotal ({quote.nights} night{quote.nights > 1 ? "s" : ""})
              </span>
              <span className="text-charcoal">{formatILS(quote.baseTotal)} ILS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-graphite">Cleaning fee</span>
              <span className="text-charcoal">{formatILS(quote.cleaningFee)} ILS</span>
            </div>
          </div>

          <div className="mt-4 border-t border-sand pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.1em] text-graphite">
                Total
              </span>
              <span className="font-serif text-2xl font-light text-charcoal">
                {formatILS(quote.totalAmount)} ILS
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone">
            Flexible cancellation: full refund up to 24 hours before check-in.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
