"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-6"
          initial={reduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            className="relative w-full max-w-lg bg-ivory p-10 md:p-14 shadow-2xl"
            initial={reduceMotion ? {} : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? {} : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-stone transition-colors hover:text-charcoal"
              aria-label={t.contactModal.close}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
              {t.contactModal.title}
            </p>
            <h3 className="mt-3 font-serif text-4xl font-light text-charcoal">
              {t.nav.contact}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-stone">
              {t.contactModal.subtitle}
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                const name = data.get("name");
                const email = data.get("email");
                const message = data.get("message");
                window.location.href = `mailto:yonatanes1@gmail.com?subject=Inquiry from ${name}&body=${message}%0A%0AFrom: ${name} (${email})`;
                onClose();
              }}
            >
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
                  {t.contactModal.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
                  {t.contactModal.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
                  {t.contactModal.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  className="mt-2 w-full resize-none border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full border border-accent bg-transparent px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white"
              >
                {t.contactModal.send}
              </button>
            </form>

            <div className="mt-8 border-t border-sand pt-6">
              <p className="text-xs text-stone">{t.contactModal.thanksMessage}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
