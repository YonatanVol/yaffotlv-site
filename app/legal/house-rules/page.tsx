import type { Metadata } from "next";
import { HouseRulesContent } from "@/components/legal/house-rules-content";

export const metadata: Metadata = {
  title: "House Rules",
  alternates: { canonical: "/legal/house-rules" },
  robots: { index: true, follow: true },
};

export default function HouseRulesPage() {
  return <HouseRulesContent />;
}
