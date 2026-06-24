import type { Metadata } from "next";
import { LegalArticle, type LegalSection } from "@/components/legal/legal-article";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

const SECTIONS: LegalSection[] = [
  {
    h: "1. Who we are",
    p: [
      "YaffoTLV operates a direct-booking website for a short-term rental apartment in Jaffa, Tel Aviv. You can reach us through the contact form on this website. This policy explains what personal data we collect and how we use it.",
    ],
  },
  {
    h: "2. Data we collect",
    p: [
      "Booking data: your name, email, phone number, stay dates, number of guests, and the amount paid.",
      "Payment data: payments are handled by our payment provider. We receive a payment reference and status, but not your full card number.",
      "Contact form: your name, email and message.",
      "Analytics and security: a random anonymous session identifier, the pages you view, and your IP address and browser user-agent. These are used for aggregate statistics and to protect the site (for example rate-limiting the admin login).",
    ],
  },
  {
    h: "3. Why we use it (legal bases)",
    p: [
      "To create, confirm and manage your booking (performance of a contract).",
      "To answer enquiries you send us (our legitimate interest and/or your consent).",
      "To keep the site secure and prevent fraud and abuse (legitimate interest).",
      "To understand aggregate usage of the site (legitimate interest).",
    ],
  },
  {
    h: "4. Who we share it with",
    p: [
      "Our payment provider (to take payment), our transactional email provider (to send confirmations), and our hosting and database providers (to run the site).",
      "Booking platforms (Airbnb, Booking.com) receive only blocked dates through calendar synchronisation — our published calendar contains no guest personal data.",
      "We do not sell your personal data.",
    ],
  },
  {
    h: "5. International transfers",
    p: [
      "Some of our service providers may process data outside Israel and the EEA. Where that happens, we rely on appropriate safeguards as required by applicable law.",
    ],
  },
  {
    h: "6. How long we keep it",
    p: [
      "Booking and payment records are kept as long as required for tax, accounting and legal purposes. Analytics and security logs are kept for a limited period and then deleted or aggregated.",
    ],
  },
  {
    h: "7. Your rights",
    p: [
      "Depending on your location, you may have the right to access, correct, delete, restrict or object to the processing of your personal data, and to data portability. Contact us to exercise these rights.",
      "If you are in the EU/EEA or UK, you may also lodge a complaint with your local data-protection supervisory authority.",
    ],
  },
  {
    h: "8. Cookies and tracking",
    p: [
      "We use a single essential cookie to keep the property owner signed in to the admin area. This is strictly necessary and is not used for tracking.",
      "Our visitor analytics are cookieless. Because we set no advertising or cross-site tracking cookies, we do not display a cookie-consent banner — we default to the most privacy-preserving setup. Your chosen language is stored locally in your own browser, not on our servers.",
    ],
  },
  {
    h: "9. Contact",
    p: [
      "For any privacy question or request, contact us through the form on this website.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalArticle title="Privacy Policy" updated="24 June 2026" sections={SECTIONS} />;
}
