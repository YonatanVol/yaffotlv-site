import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/legal/legal-article";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  alternates: { canonical: "/legal/cancellation" },
  robots: { index: true, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. Summary",
    p: [
      "Full refund (100%) for cancellations made more than 5 days before check-in.",
      "50% refund for cancellations made between 1 and 5 days before check-in. This also applies to last-minute bookings (booked for a check-in within the next 3 days).",
      "No refund (0%) for cancellations made within 1 day of check-in (the day before, or the day of arrival) and for no-shows.",
    ],
  },
  {
    h: "2. How timing is measured",
    p: [
      "Timing is measured against the check-in time — 14:00 Jerusalem time on your arrival date.",
    ],
  },
  {
    h: "3. How to cancel",
    p: [
      "Contact the host through this website or via WhatsApp, quoting your booking reference. Your cancellation takes effect when we confirm it.",
    ],
  },
  {
    h: "4. Refunds",
    p: [
      "Eligible refunds are issued to your original payment method through our payment provider, and typically appear within a few business days depending on your bank or card issuer.",
    ],
  },
  {
    h: "5. If we cancel",
    p: [
      "If we have to cancel your booking (for example due to a cross-platform double booking or circumstances beyond our control), you receive a full refund.",
    ],
  },
];

// Policy confirmed by owner 2026-06-25. The Phase-4 refund logic (with the payment
// provider) must enforce these exact tiers: >5 days = 100%, 1–5 days = 50%,
// <1 day / no-show = 0%, measured against 14:00 Jerusalem on the arrival date.
const OWNER_NOTE =
  "This policy is confirmed by the owner. The automated refund logic (built with the payment provider in Phase 4) will enforce these tiers exactly. Still pending final lawyer review and translation.";

export default function CancellationPage() {
  return (
    <LegalArticle
      title="Cancellation Policy"
      updated="24 June 2026"
      sections={SECTIONS}
      note={OWNER_NOTE}
    />
  );
}
