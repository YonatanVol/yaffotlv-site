"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, RTL_LOCALES, type Locale, type Translations } from "./translations";

interface I18nContext {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
}

const I18nCtx = createContext<I18nContext>({
  locale: "en",
  t: translations.en,
  setLocale: () => {},
  isRtl: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("yaffotlv-locale") as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("yaffotlv-locale", newLocale);
  }, []);

  const isRtl = RTL_LOCALES.includes(locale);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRtl]);

  return (
    <I18nCtx.Provider value={{ locale, t: translations[locale], setLocale, isRtl }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
