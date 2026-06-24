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
      "Full refund for cancellations made at least 24 hours before check-in (15:00 Jerusalem time on the check-in date).",
      "Cancellations made within 24 hours of check-in, and no-shows, are non-refundable.",
    ],
  },
  {
    h: "2. How to cancel",
    p: [
      "Contact the host through this website or via WhatsApp, quoting your booking reference. Your cancellation takes effect when we confirm it.",
    ],
  },
  {
    h: "3. Refunds",
    p: [
      "Eligible refunds are issued to your original payment method through our payment provider, and typically appear within a few business days depending on your bank or card issuer.",
    ],
  },
  {
    h: "4. If we cancel",
    p: [
      "If we have to cancel your booking (for example due to a cross-platform double booking or circumstances beyond our control), you receive a full refund.",
    ],
  },
];

// OWNER ACTION: confirm the policy. The booking/refund code currently enforces
// "full refund up to 24h before check-in". If you want different terms (e.g. free
// until N days before, partial after), tell Claude and it will update BOTH this
// page and the refund logic together so they always match.
const OWNER_NOTE =
  "Owner to confirm: this policy currently mirrors the code (full refund up to 24h before check-in). If you want different terms, both this page and the refund logic will be updated together so they always match.";

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
