import type { Metadata } from "next";
import { ReviewsAll } from "@/components/sections/reviews-all";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description:
    "What guests say about YaffoTLV — a renovated 2-bedroom apartment in Jaffa, Tel Aviv. ★4.7 · 140+ reviews.",
  alternates: { canonical: "/reviews" },
  robots: { index: true, follow: true },
};

export default function ReviewsPage() {
  return <ReviewsAll />;
}
