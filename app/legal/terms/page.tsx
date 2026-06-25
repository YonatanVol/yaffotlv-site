import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/legal/legal-article";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/legal/terms" },
  robots: { index: true, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. About these terms",
    p: [
      "YaffoTLV operates a direct-booking website for a short-term rental apartment in Jaffa, Tel Aviv (the “Property”). By making a booking or using this website you agree to these Terms of Service.",
    ],
  },
  {
    h: "2. Bookings",
    p: [
      "A booking is confirmed only once full payment has been received and you have received a confirmation email with a booking reference. Until then, dates are held temporarily and may be released.",
      "We may decline or cancel a booking in exceptional circumstances (for example double-booking caused by a third-party platform, or events beyond our control); in that case you receive a full refund.",
    ],
  },
  {
    h: "3. Pricing, taxes and payment",
    p: [
      "Prices are shown in Israeli New Shekels (ILS) and include 18% VAT unless stated otherwise. The price shown at checkout is the price you pay.",
      "Payments are processed by our payment provider. We do not see or store your full card details. Accepted methods include credit/debit card, Apple Pay, Google Pay and Bit.",
    ],
  },
  {
    h: "4. Cancellations and refunds",
    p: [
      "Cancellations and refunds are governed by our Cancellation Policy, available at /legal/cancellation. Please read it before booking.",
    ],
  },
  {
    h: "5. Check-in, check-out and house rules",
    p: [
      "Standard check-in is from 14:00 and check-out is by 11:00, unless otherwise agreed. Occupancy may not exceed the number of guests in your booking.",
      "No parties or events. Please treat the Property and neighbours with respect. Any house rules provided in your confirmation form part of these terms.",
    ],
  },
  {
    h: "6. Guest responsibilities and damage",
    p: [
      "Guests are responsible for the Property during their stay and for any loss or damage beyond normal wear and tear. We may charge for such damage to the payment method used for the booking.",
    ],
  },
  {
    h: "7. Liability",
    p: [
      "To the fullest extent permitted by law, our total liability arising from your booking is limited to the amount you paid for that booking. The Property is provided on an “as is” basis.",
    ],
  },
  {
    h: "8. Privacy",
    p: [
      "We process personal data as described in our Privacy Policy at /legal/privacy.",
    ],
  },
  {
    h: "9. Governing law",
    p: [
      "These terms are governed by the laws of the State of Israel, and the competent courts of Tel Aviv-Jaffa have exclusive jurisdiction.",
    ],
  },
  {
    h: "10. Contact",
    p: [
      "Questions about these terms can be sent through the contact form on this website or via WhatsApp.",
    ],
  },
];

export default function TermsPage() {
  return <LegalArticle title="Terms of Service" updated="24 June 2026" sections={SECTIONS} />;
}
