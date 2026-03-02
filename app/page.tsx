import { Hero } from "@/components/sections/hero";
import { Signature } from "@/components/sections/signature";
import { Gallery } from "@/components/sections/gallery";
import { Reveal } from "@/components/ui/reveal";

export default function Home() {
  return (
    <>
      <Hero />

      <Signature />

      {/* Breathing space — editorial quote */}
      <section className="bg-cream py-32">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-serif text-3xl font-light leading-relaxed text-charcoal md:text-4xl">
            In the oldest port city on the Mediterranean, where every stone
            holds a story, we created something new that belongs completely to
            this place.
          </p>
        </Reveal>
      </section>

      <Gallery />

      {/* Closing CTA */}
      <section id="contact" className="bg-ivory py-32">
        <Reveal className="mx-auto max-w-xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            Begin your story
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light text-charcoal md:text-5xl">
            Inquire
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            Private viewings available by appointment.
          </p>
          <a
            href="#"
            className="mt-10 inline-block border border-accent px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
          >
            Contact Us
          </a>
        </Reveal>
      </section>
    </>
  );
}
