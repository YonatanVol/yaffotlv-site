import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import { I18nProvider } from "@/lib/i18n/context";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { SocialProofBar } from "@/components/ui/social-proof-bar";
import { StructuredData } from "@/components/structured-data";
import "./globals.css";

const siteUrl = "https://yaffotlv.com";

export const metadata: Metadata = {
  title: {
    default: "YaffoTLV | Luxury Apartment in Jaffa, Tel Aviv",
    template: "%s | YaffoTLV",
  },
  description:
    "Book direct & save 10%. 3-room luxury apartment in Jaffa — 80 sqm, renovated 2024, 10 min to the beach. Superhost with 140+ reviews.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "YaffoTLV | Luxury Apartment in Jaffa, Tel Aviv",
    description:
      "Book direct & save 10%. 3-room luxury apartment in Jaffa — 80 sqm, 10 min to beach. ★ 4.71 Superhost.",
    url: siteUrl,
    siteName: "YaffoTLV",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaffoTLV | Luxury Apartment in Jaffa",
    description:
      "Book direct & save 10%. 3-room apartment in Jaffa — ★ 4.71 Superhost, 140+ reviews.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className="antialiased">
        <I18nProvider>
          {children}
          <WhatsAppButton />
          <SocialProofBar />
        </I18nProvider>
      </body>
    </html>
  );
}
