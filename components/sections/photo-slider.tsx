"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { Lightbox } from "@/components/ui/lightbox";
import { useI18n } from "@/lib/i18n/context";
import type { Translations } from "@/lib/i18n/translations";

interface Slide {
  src: string;
  labelKey: keyof Translations["slider"]["rooms"];
  alt: string;
}

const slides: Slide[] = [
  { src: "/images/livingroom1.jpg", labelKey: "livingRoom", alt: "Bright living room with panoramic Jaffa view" },
  { src: "/images/gallery-2.jpg", labelKey: "kitchen", alt: "Modern kitchen and dining area" },
  { src: "/images/gallery-1.jpg", labelKey: "bedroom1", alt: "Master bedroom with luxury finishes" },
  { src: "/images/gallery-4.jpg", labelKey: "bedroom2", alt: "Second bedroom with warm tones" },
  { src: "/images/gallery-3.jpg", labelKey: "entryway", alt: "Elegant apartment entryway" },
];

const lightboxImages = slides.map((s) => ({ src: s.src, alt: s.alt }));

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function PhotoSlider() {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { t, isRtl } = useI18n();

  const paginate = useCallback(
    (newDirection: number) => {
      setCurrent(([prev]) => {
        // In RTL, swap navigation direction so arrows feel natural
        const dir = isRtl ? -newDirection : newDirection;
        const next = (prev + dir + slides.length) % slides.length;
        return [next, dir];
      });
    },
    [isRtl]
  );

  const goTo = useCallback((index: number) => {
    setCurrent(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="bg-cream py-32">
      <Reveal className="mb-16 text-center px-6">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          {t.slider.title}
        </p>
        <h2 className="mt-4 font-serif text-5xl font-light tracking-tight text-charcoal md:text-6xl">
          {t.slider.subtitle}
        </h2>
      </Reveal>

      <div className="mx-auto max-w-5xl px-6">
        {/* Slider container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30 cursor-pointer" onClick={() => openLightbox(current)}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={reduceMotion ? undefined : slideVariants}
              initial={reduceMotion ? { opacity: 1 } : "enter"}
              animate="center"
              exit={reduceMotion ? { opacity: 0 } : "exit"}
              transition={{
                x: { type: "tween", duration: 0.5, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0"
            >
              <Image
                src={slides[current].src}
                alt={slides[current].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Left / Right arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/30 text-white backdrop-blur-sm transition-colors hover:bg-ink/60"
            aria-label={t.slider.prev}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/30 text-white backdrop-blur-sm transition-colors hover:bg-ink/60"
            aria-label={t.slider.next}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Current room label overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/60 to-transparent px-8 pb-8 pt-20"
            >
              <p className="font-serif text-3xl font-light text-white md:text-4xl">
                {t.slider.rooms[slides[current].labelKey]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* View all photos button */}
          <button
            onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-sm bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal backdrop-blur-sm transition-colors hover:bg-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="5" height="5" rx="0.5" stroke="currentColor" />
              <rect x="8.5" y="0.5" width="5" height="5" rx="0.5" stroke="currentColor" />
              <rect x="0.5" y="8.5" width="5" height="5" rx="0.5" stroke="currentColor" />
              <rect x="8.5" y="8.5" width="5" height="5" rx="0.5" stroke="currentColor" />
            </svg>
            {t.gallery?.viewAll || "View all photos"}
          </button>
        </div>

        {/* Room label tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
          {slides.map((slide, i) => (
            <button
              key={slide.labelKey}
              onClick={() => goTo(i)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                i === current
                  ? "border-b-2 border-accent text-charcoal"
                  : "text-stone hover:text-charcoal"
              }`}
            >
              {t.slider.rooms[slide.labelKey]}
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-accent" : "w-1.5 bg-sand hover:bg-stone"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
