import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "StickerPack";

export const metadata: Metadata = {
  title: `${appName} — TikTok stickers to WhatsApp packs`,
  description:
    "Turn TikTok comment sticker replies into installable WhatsApp sticker packs in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
