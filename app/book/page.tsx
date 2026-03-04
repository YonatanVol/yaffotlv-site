import { BookPageContent } from "@/components/booking/book-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Reserve your luxury stay at YaffoTLV in historic Jaffa, Tel Aviv.",
};

export default function BookPage() {
  return <BookPageContent />;
}
