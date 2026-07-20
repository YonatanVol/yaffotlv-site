"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface GuestFormProps {
  onSubmit: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: number;
  }) => void;
  loading: boolean;
  paymentsEnabled?: boolean;
  /** Dates chosen upstream, recorded alongside an unfinished enquiry. */
  checkIn?: string;
  checkOut?: string;
}

export function GuestForm({
  onSubmit,
  loading,
  paymentsEnabled,
  checkIn,
  checkOut,
}: GuestFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const { t, locale } = useI18n();

  /**
   * Save the enquiry once the guest has finished entering their email and moved
   * on, so an abandoned booking can still be followed up. Fire-and-forget: this
   * must never interfere with actually completing the booking.
   */
  const captureLead = () => {
    const value = email.trim();
    const hasEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
    // A phone number alone is still worth chasing here, since enquiries run
    // over WhatsApp — but don't fire until there is something usable.
    const hasPhone = phone.replace(/\D/g, "").length >= 7;
    if (!hasEmail && !hasPhone) return;
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        email: hasEmail ? value : undefined,
        name: name || undefined,
        phone: phone || undefined,
        checkIn,
        checkOut,
        guests,
        stage: name && phone ? "filled_details" : "typed_email",
        locale,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        sessionId:
          typeof window !== "undefined"
            ? sessionStorage.getItem("yaffotlv-session-id") ?? undefined
            : undefined,
      }),
    }).catch(() => {
      /* analytics must never break checkout */
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ guestName: name, guestEmail: email, guestPhone: phone, guestCount: guests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {t.book.guestName}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {t.book.guestEmail}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={captureLead}
          className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
        />
        <p className="mt-1.5 text-[11px] leading-relaxed text-stone">
          {t.book.enquiryFollowUpNotice ||
            "If you don't finish, we may email you about this enquiry. Unsubscribe anytime."}
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {t.book.guestPhone}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={captureLead}
          className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
          placeholder="+972..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {t.book.guestCount}
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n} {t.book.guests}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-2 text-xs leading-relaxed text-stone">
        <input
          type="checkbox"
          required
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 accent-accent"
        />
        <span>
          {t.book.agreeRules ||
            "I have read and agree to the House Rules, Terms and Cancellation Policy."}
        </span>
      </label>
      <p className="text-xs text-stone">
        <Link href="/legal/house-rules" target="_blank" className="underline hover:text-accent">
          {t.houseRules?.title || "House Rules"}
        </Link>
        {" · "}
        <Link href="/legal/terms" target="_blank" className="underline hover:text-accent">
          {t.footer?.terms || "Terms"}
        </Link>
        {" · "}
        <Link href="/legal/cancellation" target="_blank" className="underline hover:text-accent">
          {t.footer?.cancellation || "Cancellation Policy"}
        </Link>
      </p>

      <button
        type="submit"
        disabled={loading || !agreed}
        className="mt-4 w-full border border-accent px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-50"
      >
        {loading ? "..." : paymentsEnabled ? t.book.payNow : t.book.requestBook || "Request to book on WhatsApp"}
      </button>
    </form>
  );
}
