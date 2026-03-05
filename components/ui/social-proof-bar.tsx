"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

const DISMISS_KEY = "yaffotlv_social_proof_dismissed";

export function SocialProofBar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(true); // start hidden, show after mount
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    t.socialProof?.booked || "🔥 3 guests booked this week",
    t.socialProof?.rating || "★★★★★ Rated by 140+ guests",
    t.socialProof?.save || "💰 Save 10% when you book direct",
    t.socialProof?.superhost || "🏆 Superhost · 12 years hosting",
  ];

  // Check sessionStorage after mount
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!wasDismissed) {
      // Show after a short delay
      const timer = setTimeout(() => setDismissed(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Rotate messages
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed, messages.length]);

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-full border border-sand/80 bg-ivory/95 px-5 py-2.5 shadow-lg backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium text-charcoal whitespace-nowrap"
              >
                {messages[messageIndex]}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={handleDismiss}
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand/50 hover:text-charcoal"
              aria-label="Dismiss"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M8 2L2 8M2 2l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
