interface LogoMarkProps {
  className?: string;
  /** The sun keeps the brand's brass accent; pass a colour to override. */
  sunColor?: string;
}

/**
 * YaffoTLV brand mark — the Jaffa arch with a sun above three waves.
 *
 * Vector rather than raster so it stays crisp at any size and inherits its
 * colour from context: the arch and waves use `currentColor` (white in the
 * navbar over the hero), while the sun holds the brass accent, matching the
 * "TLV" in the wordmark. Proportions are measured from the supplied artwork.
 */
export function LogoMark({ className, sunColor = "var(--brass, #b8976a)" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" aria-hidden="true" className={className}>
      {/* arch: legs up from the base, semicircular top */}
      <path
        d="M8 56V24a16 16 0 0 1 32 0v32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="20" r="3" fill={sunColor} />
      {/* three waves, fading downward — gentle ripples, kept legible at 32px */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8 40q4-1.8 8 0t8 0t8 0t8 0" />
        <path d="M8 45.5q4-1.8 8 0t8 0t8 0t8 0" opacity="0.62" />
        <path d="M8 51q4-1.8 8 0t8 0t8 0t8 0" opacity="0.42" />
      </g>
    </svg>
  );
}
