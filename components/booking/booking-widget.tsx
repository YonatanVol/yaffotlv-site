"use client";

import { useState, useEffect } from "react";
import { BookingDatePicker } from "./date-picker";
import { PriceBreakdown } from "./price-breakdown";
import { GuestForm } from "./guest-form";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateDisplay } from "@/lib/dates";
import { formatILS } from "@/lib/pricing";
import type { PriceQuote } from "@/lib/pricing";

type BookingStep = "dates" | "details" | "processing";

export function BookingWidget() {
  const [step, setStep] = useState<BookingStep>("dates");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ checkIn: string; checkOut: string } | null>(null);
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch availability on mount
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => setBlockedDates(data.blockedDates || []))
      .catch(() => setBlockedDates([]));
  }, []);

  // Fetch price when range changes
  useEffect(() => {
    if (!selectedRange) {
      setQuote(null);
      return;
    }
    setQuoteLoading(true);
    setError(null);
    fetch("/api/price-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedRange),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setQuote(null);
        } else {
          setQuote(data);
        }
        setQuoteLoading(false);
      })
      .catch(() => {
        setError("Failed to get price. Please try again.");
        setQuoteLoading(false);
      });
  }, [selectedRange]);

  const handleBooking = async (guestData: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: number;
  }) => {
    if (!selectedRange) return;
    setBookingLoading(true);
    setError(null);

    try {
      // 1. Create draft booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedRange, ...guestData }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        setError(bookingData.error || "Failed to create booking");
        setBookingLoading(false);
        if (bookingRes.status === 409) {
          // Dates taken — refresh availability
          const avRes = await fetch("/api/availability");
          const avData = await avRes.json();
          setBlockedDates(avData.blockedDates || []);
          setStep("dates");
        }
        return;
      }

      // 2. Create Stripe checkout and redirect
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: bookingData.reservationId }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        setError(checkoutData.error || "Failed to start payment");
        setBookingLoading(false);
        return;
      }

      window.location.href = checkoutData.checkoutUrl;
    } catch {
      setError("Something went wrong. Please try again.");
      setBookingLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === "dates" && (
          <motion.div
            key="dates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Step 1 of 2
            </p>
            <h2 className="mb-8 font-serif text-3xl font-light text-charcoal">
              Select Your Dates
            </h2>

            <BookingDatePicker
              blockedDates={blockedDates}
              onRangeSelect={setSelectedRange}
            />

            <PriceBreakdown quote={quote} loading={quoteLoading} />

            {quote && (
              <button
                onClick={() => setStep("details")}
                className="mt-8 w-full border border-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
              >
                Continue
              </button>
            )}
          </motion.div>
        )}

        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Step 2 of 2
            </p>
            <h2 className="mb-8 font-serif text-3xl font-light text-charcoal">
              Guest Details
            </h2>

            {/* Selected dates summary */}
            {selectedRange && quote && (
              <div className="mb-8 border border-sand bg-ivory p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm text-graphite">
                      {formatDateDisplay(selectedRange.checkIn)} &rarr; {formatDateDisplay(selectedRange.checkOut)}
                    </p>
                    <p className="mt-1 text-xs text-stone">
                      {quote.nights} night{quote.nights > 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-serif text-xl font-light text-charcoal">
                    {formatILS(quote.totalAmount)} ILS
                  </p>
                </div>
              </div>
            )}

            <GuestForm onSubmit={handleBooking} loading={bookingLoading} />

            <button
              onClick={() => setStep("dates")}
              className="mt-4 w-full py-3 text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-charcoal"
            >
              &larr; Back to dates
            </button>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-accent" />
            <p className="mt-6 font-serif text-xl text-charcoal">
              Preparing your booking...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
