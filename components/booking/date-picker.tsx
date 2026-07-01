"use client";

import { useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { he, ar, enUS, ru, fr, es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useI18n } from "@/lib/i18n/context";
import { todayJerusalem, isRangeAvailable, formatDateDisplay, countNights } from "@/lib/dates";

// Map the site locale to a date-fns locale for localized month/day names.
const DATE_LOCALES: Record<string, typeof enUS> = { he, ar, en: enUS, ru, fr, es };

/** Local calendar day → "YYYY-MM-DD" (no UTC shift). */
function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface BookingDatePickerProps {
  blockedDates: string[];
  onRangeSelect: (range: { checkIn: string; checkOut: string } | null) => void;
}

export function BookingDatePicker({ blockedDates, onRangeSelect }: BookingDatePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const { t, locale, isRtl } = useI18n();

  const blockedSet = useMemo(() => new Set(blockedDates), [blockedDates]);
  // Booked nights are shown struck-through but stay clickable — a booked day can be a
  // valid CHECK-OUT (same-day turnover); only the nights you'd occupy must be free.
  const unavailableDates = useMemo(() => blockedDates.map((d) => new Date(d + "T12:00:00")), [blockedDates]);
  const today = new Date(todayJerusalem() + "T12:00:00");

  const emit = (r: DateRange | undefined) => {
    setRange(r);
    if (r?.from && r?.to) onRangeSelect({ checkIn: toStr(r.from), checkOut: toStr(r.to) });
    else onRangeSelect(null);
  };

  const handleSelect = (next: DateRange | undefined) => {
    setError(null);
    if (!next?.from) {
      emit(undefined);
      return;
    }
    const from = toStr(next.from);

    // First pick (check-in only): reject if that first night is already booked.
    if (!next.to) {
      if (blockedSet.has(from)) {
        setError(t.book.datesUnavailable || "Those dates aren't available. Please pick others.");
        emit(undefined);
        return;
      }
      emit({ from: next.from, to: undefined });
      return;
    }

    // Full range: check-out must be after check-in, and every occupied night must be free.
    const to = toStr(next.to);
    if (to <= from) {
      emit({ from: next.to, to: undefined }); // reversed/same-day → restart from the new day
      return;
    }
    if (!isRangeAvailable(from, to, blockedSet)) {
      setError(t.book.datesUnavailable || "Some of those nights are already booked. Please pick different dates.");
      emit({ from: next.from, to: undefined }); // keep the check-in, let them re-pick check-out
      return;
    }
    emit(next);
  };

  const nights = range?.from && range?.to ? countNights(toStr(range.from), toStr(range.to)) : 0;

  return (
    <div className="booking-calendar" dir={isRtl ? "rtl" : "ltr"}>
      <style>{`.booking-calendar .day-unavailable { text-decoration: line-through; opacity: 0.45; }`}</style>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        defaultMonth={today}
        startMonth={today}
        locale={DATE_LOCALES[locale] ?? enUS}
        dir={isRtl ? "rtl" : "ltr"}
        weekStartsOn={0} // Sunday-first (correct for Israel)
        disabled={{ before: today }}
        modifiers={{ unavailable: unavailableDates }}
        modifiersClassNames={{ unavailable: "day-unavailable" }}
        numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
        showOutsideDays={false}
      />

      <p className="mt-3 text-center text-xs text-stone">
        {range?.from && !range?.to
          ? t.book.pickCheckout || "Now pick your check-out date (the morning you leave)."
          : t.book.pickDates || "Tap your check-in date, then your check-out date. One night = two dates."}
      </p>

      {range?.from && range?.to && (
        <p className="mt-1 text-center text-sm text-graphite">
          {formatDateDisplay(toStr(range.from))} → {formatDateDisplay(toStr(range.to))} · {nights}{" "}
          {nights === 1 ? t.book.night || "night" : t.book.nights || "nights"}
        </p>
      )}

      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
