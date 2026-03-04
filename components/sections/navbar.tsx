"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface NavbarProps {
  onContactClick: () => void;
}

export function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Gallery", action: () => scrollTo("gallery") },
    { label: "The Residence", action: () => scrollTo("signature") },
    { label: "Contact", action: () => { setMobileOpen(false); onContactClick(); } },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-ink/90 backdrop-blur-md" : "bg-transparent"
        }`}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif text-xl font-light tracking-wide text-white transition-opacity hover:opacity-70"
          >
            YaffoTLV
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/book"
              className="border border-white/30 px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative h-6 w-6 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`absolute left-0 h-px w-6 bg-white transition-all duration-300 ${
                mobileOpen ? "top-3 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-px w-6 bg-white transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-white transition-all duration-300 ${
                mobileOpen ? "top-3 -rotate-45" : "top-5"
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink/95 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={link.action}
                className="py-4 font-serif text-3xl font-light text-white transition-colors hover:text-accent-light"
                initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + links.length * 0.08, duration: 0.4 }}
            >
              <Link
                href="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-block border border-white/30 px-8 py-3 font-serif text-2xl font-light text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                Book Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
