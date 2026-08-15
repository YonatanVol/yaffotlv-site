"use client";

import { useI18n } from "@/lib/i18n/context";
import { HOST_STATS, hasVerifiedRating } from "@/lib/facts";

/**
 * Trust badges. The "Superhost" badge and the five-star row used to render
 * unconditionally, asserting a status and a rating nobody had verified. Both are
 * now gated on `lib/facts.ts` and reappear automatically once real figures exist.
 */
export function TrustBadges() {
  const { t } = useI18n();

  const badges: Array<{ icon?: string; label?: string; custom?: React.ReactNode }> = [];

  if (HOST_STATS.isSuperhost) {
    badges.push({ icon: "🏆", label: t.trustBadges?.superhost || "Superhost" });
  }
  if (hasVerifiedRating()) {
    badges.push({
      custom: (
        <span className="flex items-center gap-1">
          <span className="text-xs tracking-tight" style={{ color: "var(--brass)" }}>
            ★★★★★
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-stone">
            {HOST_STATS.rating}
          </span>
        </span>
      ),
    });
  }
  badges.push({ icon: "🔒", label: t.trustBadges?.secure || "Secure Payment" });
  badges.push({ icon: "💰", label: t.trustBadges?.save || "10% Cheaper" });

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 rounded-full border border-sand/60 bg-cream/50 px-3 py-1.5 text-xs font-medium text-graphite"
        >
          {badge.custom ? (
            badge.custom
          ) : (
            <>
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
