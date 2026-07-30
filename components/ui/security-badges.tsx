"use client";

import { useI18n } from "@/lib/i18n/context";

/**
 * Reassurance strip on the booking page.
 *
 * Every claim here has to be true: the old "Verified Host · Superhost since
 * 2012" was unverifiable and is gone. Labels come from `t.securityBadges`, which
 * is a required translation block — no English fallbacks, so a missing locale
 * fails the build instead of silently showing English to a Hebrew visitor.
 */
const badges = [
  { icon: "\u{1F512}", labelKey: "ssl" as const },
  { icon: "\u{1F6E1}️", labelKey: "payment" as const },
  { icon: "✓", labelKey: "verified" as const },
  { icon: "\u{1F510}", labelKey: "data" as const },
];

interface SecurityBadgesProps {
  className?: string;
}

export function SecurityBadges({ className = "" }: SecurityBadgesProps) {
  const { t } = useI18n();

  return (
    <div className={`flex flex-col items-center gap-3 py-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {badges.map((badge) => (
          <span
            key={badge.labelKey}
            className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone/70"
          >
            <span className="text-xs">{badge.icon}</span>
            <span>{t.securityBadges[badge.labelKey]}</span>
          </span>
        ))}
      </div>
      <div className="h-px w-24 bg-sand/40" />
    </div>
  );
}
