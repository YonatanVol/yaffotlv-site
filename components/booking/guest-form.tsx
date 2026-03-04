"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface GuestFormProps {
  onSubmit: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: number;
  }) => void;
  loading: boolean;
}

export function GuestForm({ onSubmit, loading }: GuestFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const { t } = useI18n();

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
          className="mt-2 w-full border-b border-sand bg-transparent pb-2 text-sm text-charcoal outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-[0.15em] text-graphite">
          {t.book.guestPhone}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {t.book.guests}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full border border-accent px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-50"
      >
        {loading ? "..." : t.book.payNow}
      </button>
    </form>
  );
}
