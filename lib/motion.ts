import type { Variants, Transition } from "framer-motion";

// ── Reusable transitions ────────────────────────────────────────────

export const transitionCinematic: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionReveal: Transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionQuick: Transition = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1],
};

// ── Variants ────────────────────────────────────────────────────────

/** Fade up — the most common reveal pattern */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionReveal,
  },
};

/** Fade in — no vertical movement */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionReveal,
  },
};

/** Stagger container — wraps children that each use their own variants */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Clip-path wipe reveal (left to right) */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

/** Scale in from center */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionCinematic,
  },
};
