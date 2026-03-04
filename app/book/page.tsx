import { BookingWidget } from "@/components/booking/booking-widget";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Reserve your luxury stay at YaffoTLV in historic Jaffa, Tel Aviv.",
};

export default function BookPage() {
  return (
    <>
      <section className="bg-ink pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">
            Reserve Your Stay
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-white md:text-6xl">
            Book Now
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Select your dates and complete your reservation instantly.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16">
        <BookingWidget />
      </section>

      <section className="bg-ivory py-12">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-sm text-stone">
            Flexible cancellation: full refund up to 24 hours before check-in.
          </p>
        </div>
      </section>
    </>
  );
}
