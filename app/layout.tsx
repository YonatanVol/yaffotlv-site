import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import { I18nProvider } from "@/lib/i18n/context";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { SocialProofBar } from "@/components/ui/social-proof-bar";
import { Footer } from "@/components/sections/footer";
import { StructuredData } from "@/components/structured-data";
import { AnalyticsProvider } from "@/components/analytics-provider";
import "./globals.css";

const siteUrl = "https://yaffotlv.com";

// Every claim below is checkable: size, room count, renovation year and the walk
// to the beach. The old copy sold "luxury", a "Superhost" badge and "140+
// reviews" — none of which we can substantiate.
export const metadata: Metadata = {
  title: {
    default: "YaffoTLV | 3-Room Apartment in Jaffa, Tel Aviv",
    template: "%s | YaffoTLV",
  },
  description:
    "A bright 3-room apartment in Jaffa — 80 sqm, renovated 2024, a 10-minute walk from the beach. Book direct and save 10%.",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  // Icons come from the app/ file convention: icon.svg (browsers) and
  // apple-icon.png (iOS home screen). No manual `icons` override needed.
  openGraph: {
    title: "YaffoTLV | 3-Room Apartment in Jaffa, Tel Aviv",
    description:
      "A bright 3-room apartment in Jaffa — 80 sqm, a 10-minute walk from the beach. Book direct and save 10%.",
    url: siteUrl,
    siteName: "YaffoTLV",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaffoTLV | 3-Room Apartment in Jaffa",
    description:
      "A bright 3-room apartment in Jaffa — 80 sqm, 10 minutes from the beach. Book direct and save 10%.",
    images: ["/opengraph-image"],
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
          <AnalyticsProvider>
            {children}
            <Footer />
            <WhatsAppButton />
            <SocialProofBar />
          </AnalyticsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
