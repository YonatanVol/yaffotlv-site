"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface NavbarProps {
  onContactClick: () => void;
}

type NavLink = { label: string; href?: string; action?: () => void };

export function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section links use hash hrefs so they work from ANY page (Next navigates to the
  // home page and scrolls; on the home page it scrolls smoothly via global CSS).
  const links: NavLink[] = [
    { label: t.nav.gallery, href: "/#gallery" },
    { label: t.nav.residence, href: "/#apartment" },
    { label: t.nav.reviews || "Reviews", href: "/reviews" },
    { label: t.nav.contact, action: () => { setMobileOpen(false); onContactClick(); } },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 animate-[fadeInDown_0.8s_ease-out_1.5s_both] ${
          scrolled ? "bg-ink/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-baseline gap-0.5 transition-opacity hover:opacity-70"
          >
            <span className="font-serif text-xl font-light uppercase tracking-[0.2em] text-white">
              Yaffo
            </span>
            <span className="font-serif text-lg font-medium uppercase tracking-[0.15em] text-accent">
              TLV
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </button>
              )
            )}
            <Link
              href="/book"
              className="border border-white/30 px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
            >
              {t.nav.bookNow}
            </Link>
            <LanguageToggle />
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative h-6 w-6"
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
        </div>
      </nav>

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
            {links.map((link, i) => {
              const cls =
                "py-4 font-serif text-3xl font-light text-white transition-colors hover:text-accent-light";
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  {link.href ? (
                    <Link href={link.href} onClick={() => setMobileOpen(false)} className={cls}>
                      {link.label}
                    </Link>
                  ) : (
                    <button onClick={link.action} className={cls}>
                      {link.label}
                    </button>
                  )}
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + links.length * 0.08, duration: 0.4 }}
            >
              <Link
                href="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-block border border-white/30 px-8 py-3 font-serif text-2xl font-light text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                {t.nav.bookNow}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
