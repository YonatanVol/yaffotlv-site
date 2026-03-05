"use client";

import { useI18n } from "@/lib/i18n/context";

export function TrustBadges() {
  const { t } = useI18n();

  const badges = [
    { icon: "🏆", label: t.trustBadges?.superhost || "Superhost" },
    { icon: "⭐", label: "4.71 / 5" },
    { icon: "🔒", label: t.trustBadges?.secure || "Secure Payment" },
    { icon: "💰", label: t.trustBadges?.save || "10% Cheaper" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 rounded-full border border-sand/60 bg-cream/50 px-3 py-1.5 text-xs font-medium text-graphite"
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
