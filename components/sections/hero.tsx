"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const motionProps = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 1.2, delay, ease: EASE_OUT_EXPO },
        };

  return (
    <section
      ref={containerRef}
      className="grain relative h-screen w-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: bgY }}
      >
        <Image
          src="/images/livingroom-hero.jpg"
          alt="Bright living room with panoramic Jaffa view"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(to bottom, rgba(26,24,22,0.1) 0%, rgba(26,24,22,0.5) 100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={reduceMotion ? undefined : { y: textY, opacity }}
      >
        <motion.p
          className="text-xs font-medium uppercase tracking-[0.3em] text-white/70"
          {...motionProps(0.3)}
        >
          {t.hero.overline}
        </motion.p>

        <motion.h1
          className="mt-6 font-serif text-7xl font-light tracking-tight text-white md:text-8xl lg:text-9xl"
          {...motionProps(0.6)}
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          className="mt-6 max-w-md font-serif text-xl font-light italic text-white/80 md:text-2xl"
          {...motionProps(1.0)}
        >
          {t.hero.tagline}
        </motion.p>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.0 }}
        >
          <motion.div
            className="h-12 w-px bg-white/40"
            animate={reduceMotion ? {} : { scaleY: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
