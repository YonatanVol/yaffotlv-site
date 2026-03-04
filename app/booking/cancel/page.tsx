import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Cancelled",
};

export default function BookingCancelPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone">
          Payment Not Completed
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-charcoal">
          Booking Not Completed
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-stone">
          Your payment was not completed. No charges have been made.
          Your selected dates will be released shortly.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/book"
            className="inline-block border border-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            Try Again
          </Link>
          <br />
          <Link
            href="/"
            className="mt-3 inline-block py-3 text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-charcoal"
          >
            Return Home
          </Link>
        </div>
      </div>
    </section>
  );
}
