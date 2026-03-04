import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed",
};

export default function BookingSuccessPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 16L14 22L24 10"
              stroke="#b8976a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          Confirmed
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
          Booking Confirmed
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-stone">
          Thank you for your reservation. A confirmation email has been sent with
          your booking details.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/"
            className="inline-block border border-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
