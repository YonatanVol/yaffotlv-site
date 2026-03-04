import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import { I18nProvider } from "@/lib/i18n/context";
import "./globals.css";

const siteUrl = "https://yaffotlv.com";

export const metadata: Metadata = {
  title: {
    default: "YaffoTLV | Luxury Residence in Jaffa, Tel Aviv",
    template: "%s | YaffoTLV",
  },
  description:
    "A private residence in historic Jaffa — where Mediterranean heritage meets contemporary luxury. 2 bedrooms, 8 min to the sea.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "YaffoTLV | Luxury Residence in Jaffa, Tel Aviv",
    description:
      "A private residence in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
    url: siteUrl,
    siteName: "YaffoTLV",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaffoTLV | Luxury Residence in Jaffa",
    description:
      "A private residence in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
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
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
