"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Reveal, RevealItem } from "@/components/ui/reveal";

interface GalleryImage {
  alt: string;
  aspect: "portrait" | "landscape" | "square";
}

const images: GalleryImage[] = [
  { alt: "Limestone courtyard at sunset", aspect: "portrait" },
  { alt: "Mediterranean terrace view", aspect: "landscape" },
  { alt: "Interior living space", aspect: "square" },
  { alt: "Jaffa port at golden hour", aspect: "portrait" },
];

const aspectClasses: Record<GalleryImage["aspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

function GalleryItem({ image, index }: { image: GalleryImage; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${5 + index * 3}%`, `-${5 + index * 3}%`]
  );

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${aspectClasses[image.aspect]}`}
      style={reduceMotion ? undefined : { y }}
    >
      {/* Gradient placeholder — replace with next/image when photos are ready */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${135 + index * 30}deg, var(--sand), var(--ivory))`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <span className="text-center text-sm uppercase tracking-[0.2em] text-stone">
          {image.alt}
        </span>
      </div>
    </motion.div>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="bg-cream px-6 py-32 md:px-12 lg:px-24">
      <Reveal className="mb-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          The Collection
        </p>
        <h2 className="mt-4 font-serif text-5xl font-light tracking-tight text-charcoal md:text-6xl">
          Spaces that speak softly
        </h2>
      </Reveal>

      <Reveal variant="stagger">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {images.map((image, i) => (
            <RevealItem key={image.alt}>
              <GalleryItem image={image} index={i} />
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
