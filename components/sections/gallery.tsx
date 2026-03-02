"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Reveal, RevealItem } from "@/components/ui/reveal";

interface GalleryImage {
  src: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
}

const images: GalleryImage[] = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Luxury residence exterior",
    aspect: "portrait",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Light-filled interior space",
    aspect: "landscape",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Designed living area",
    aspect: "square",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Contemporary architecture",
    aspect: "portrait",
  },
];

const aspectClasses: Record<GalleryImage["aspect"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

function GalleryItem({
  image,
  index,
}: {
  image: GalleryImage;
  index: number;
}) {
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
      className={`group relative cursor-pointer overflow-hidden ${aspectClasses[image.aspect]}`}
      style={reduceMotion ? undefined : { y }}
    >
      {/* Image with zoom-on-hover */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Hover overlay with caption */}
      <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
      <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white">
          {image.alt}
        </p>
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
