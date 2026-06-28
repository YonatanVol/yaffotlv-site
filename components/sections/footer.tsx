"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

// Yonatan's Google Business Profile.
const GBP_URL = "https://maps.app.goo.gl/MG8Hppe3vibuFLJb8";

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();

  // Public pages only — admin has its own chrome.
  if (pathname?.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sand bg-ivory">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="font-serif text-xl font-light text-charcoal">
              Yaffo<span className="text-accent">TLV</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {t.footer?.tagline || "Luxury direct-booking apartment in Jaffa, Tel Aviv."}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-stone">
            <Link href="/legal/terms" className="transition-colors hover:text-accent">
              {t.footer?.terms || "Terms of Service"}
            </Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-accent">
              {t.footer?.privacy || "Privacy Policy"}
            </Link>
            <Link href="/legal/cancellation" className="transition-colors hover:text-accent">
              {t.footer?.cancellation || "Cancellation Policy"}
            </Link>
            <Link href="/legal/house-rules" className="transition-colors hover:text-accent">
              {t.houseRules?.title || "House Rules"}
            </Link>
            {GBP_URL ? (
              <a href={GBP_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                Google Business Profile
              </a>
            ) : null}
          </nav>
        </div>

        <p className="mt-10 text-xs text-stone/70">
          © {year} YaffoTLV. {t.footer?.rights || "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
