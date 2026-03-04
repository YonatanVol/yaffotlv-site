"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

export function Signature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven values — clip wipe, line expansion, fade
  const clipProgress = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const topLineWidth = useTransform(
    scrollYProgress,
    [0.15, 0.45],
    ["0%", "100%"]
  );
  const bottomLineWidth = useTransform(
    scrollYProgress,
    [0.45, 0.65],
    ["0%", "100%"]
  );
  const subtitleOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.35, 0.5], [20, 0]);

  return (
    <section
      ref={containerRef}
      id="signature"
      className="relative flex min-h-screen items-center justify-center bg-ivory px-6 py-32"
    >
      <div className="text-center">
        {/* Expanding brass rule */}
        <motion.div
          className="mx-auto h-px bg-accent"
          style={reduceMotion ? { width: "100%" } : { width: topLineWidth }}
        />

        {/* Headline with clip-path wipe reveal */}
        <motion.h2
          className="mt-12 font-serif text-5xl font-light tracking-tight text-charcoal md:text-6xl lg:text-7xl"
          style={
            reduceMotion
              ? undefined
              : {
                  clipPath: useTransform(
                    clipProgress,
                    (v) => `inset(0 ${v}% 0 0)`
                  ),
                }
          }
        >
          {t.signature.headline}
        </motion.h2>

        {/* Subtitle fades in after headline */}
        <motion.p
          className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-stone"
          style={
            reduceMotion
              ? undefined
              : { opacity: subtitleOpacity, y: subtitleY }
          }
        >
          {t.signature.subtitle}
        </motion.p>

        {/* Bottom brass rule */}
        <motion.div
          className="mx-auto mt-12 h-px bg-accent"
          style={
            reduceMotion ? { width: "100%" } : { width: bottomLineWidth }
          }
        />
      </div>
    </section>
  );
}
