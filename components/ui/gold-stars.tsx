"use client";

/**
 * Gold star rating component — replaces numeric "4.71" with visual gold stars.
 * Shows 5 filled stars in brass/gold color with "Rated" label.
 */
export function GoldStars({ size = "md", showLabel = true }: { size?: "sm" | "md" | "lg"; showLabel?: boolean }) {
  const sizeMap = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      {showLabel && (
        <span className="text-xs font-medium uppercase tracking-wider text-stone">Rated</span>
      )}
      <span className={`${sizeMap[size]} tracking-tight`} style={{ color: "var(--brass)" }}>
        ★★★★★
      </span>
    </span>
  );
}
