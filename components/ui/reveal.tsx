"use client";

import { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";

type RevealVariant = "fade-up" | "fade-in" | "stagger";

const variantMap: Record<RevealVariant, Variants> = {
  "fade-up": fadeUp,
  "fade-in": fadeIn,
  stagger: staggerContainer,
};

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  once?: boolean;
  threshold?: number;
  as?: "div" | "section" | "article";
}

export function Reveal({
  children,
  variant = "fade-up",
  className,
  delay = 0,
  once = true,
  threshold = 0.2,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const reduceMotion = useReducedMotion();

  const variants = variantMap[variant];
  // Create the motion component ONCE per `as` value. Recreating it on every
  // render remounts the node, which resets the in-view observer and restarts
  // the entrance animation from opacity:0 — leaving the section stuck invisible.
  const Component = useMemo(() => motion.create(as), [as]);

  return (
    <Component
      ref={ref}
      initial={reduceMotion ? "visible" : "hidden"}
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Component>
  );
}

/** Child item for stagger containers — uses fadeUp variant */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : fadeUp}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
