"use client";

import { useI18n } from "@/lib/i18n/context";

const badges = [
  { icon: "\u{1F512}", labelKey: "ssl" as const, fallback: "256-bit SSL Encryption" },
  { icon: "\u{1F6E1}\uFE0F", labelKey: "payment" as const, fallback: "Secure Payment Processing" },
  { icon: "\u2713", labelKey: "verified" as const, fallback: "Verified Host \u00B7 Superhost since 2012" },
  { icon: "\u{1F510}", labelKey: "data" as const, fallback: "Your data is encrypted and never shared" },
];

interface SecurityBadgesProps {
  className?: string;
}

export function SecurityBadges({ className = "" }: SecurityBadgesProps) {
  const { t } = useI18n();

  // Allow i18n overrides via t.securityBadges.*
  const securityT = (t as unknown as Record<string, unknown>).securityBadges as
    | Record<string, string>
    | undefined;

  return (
    <div className={`flex flex-col items-center gap-3 py-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {badges.map((badge) => (
          <span
            key={badge.labelKey}
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone/70"
          >
            <span className="text-xs">{badge.icon}</span>
            <span>{securityT?.[badge.labelKey] ?? badge.fallback}</span>
          </span>
        ))}
      </div>
      <div className="h-px w-24 bg-sand/40" />
    </div>
  );
}
