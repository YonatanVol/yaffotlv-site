import { BookPageContent } from "@/components/booking/book-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Check availability and book directly — a 3-room apartment in Jaffa, Tel Aviv.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book Your Stay | YaffoTLV",
    description: "Check availability and book directly — a 3-room apartment in Jaffa, Tel Aviv.",
    url: "/book",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function BookPage() {
  return <BookPageContent />;
}
