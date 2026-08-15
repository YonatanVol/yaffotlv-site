import type { Metadata } from "next";
import { ReviewsAll } from "@/components/sections/reviews-all";
import { getSiteReviews } from "@/lib/google-reviews";

export const metadata: Metadata = {
  title: "Guest Reviews",
  description:
    "What guests say about YaffoTLV — a renovated 2-bedroom apartment in Jaffa, Tel Aviv.",
  alternates: { canonical: "/reviews" },
  robots: { index: true, follow: true },
};

export default async function ReviewsPage() {
  return <ReviewsAll siteReviews={await getSiteReviews()} />;
}
