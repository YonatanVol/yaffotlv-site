import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://yaffotlv.com";

export const metadata: Metadata = {
  title: {
    default: "YaffoTLV | Luxury Residence in Jaffa, Tel Aviv",
    template: "%s | YaffoTLV",
  },
  description:
    "A design-forward stay in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "YaffoTLV | Luxury Residence in Jaffa, Tel Aviv",
    description:
      "A design-forward stay in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
    url: siteUrl,
    siteName: "YaffoTLV",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaffoTLV | Luxury Residence in Jaffa",
    description:
      "A design-forward stay in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
