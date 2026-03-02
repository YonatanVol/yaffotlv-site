import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "YaffoTLV | Luxury Residence in Jaffa, Tel Aviv",
  description:
    "A design-forward stay in historic Jaffa — where Mediterranean heritage meets contemporary luxury.",
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
