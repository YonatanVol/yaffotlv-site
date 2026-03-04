"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { LOCALE_FLAGS, type Locale } from "@/lib/i18n/translations";

const LOCALES = Object.keys(LOCALE_FLAGS) as Locale[];

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-sm transition-colors hover:border-white/40 hover:bg-white/10"
        aria-label="Change language"
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale].flag}</span>
        <span className="hidden text-xs font-medium text-white/80 sm:inline">
          {locale.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden border border-sand/30 bg-ink/95 backdrop-blur-xl">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                locale === loc
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{LOCALE_FLAGS[loc].flag}</span>
              <span className="font-medium">{LOCALE_FLAGS[loc].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
