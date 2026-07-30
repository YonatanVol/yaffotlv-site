"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { he, ar, enUS, ru, fr, es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useI18n } from "@/lib/i18n/context";
import {
  todayJerusalem,
  isRangeAvailable,
  countNights,
  firstAvailableMonth,
} from "@/lib/dates";

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
  const todayStr = todayJerusalem();
  const today = new Date(todayStr + "T12:00:00");

  // Open on the first month that actually has a free night. When the current
  // month is sold out, landing on it shows nothing but struck-through dates and
  // reads as a broken calendar — even though later months are wide open.
  const openingMonth = useMemo(() => {
    const first = firstAvailableMonth(blockedSet, todayStr);
    return first ? new Date(first + "T12:00:00") : today;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedSet, todayStr]);

  const [month, setMonth] = useState<Date>(openingMonth);
  // blockedDates arrive from /api/availability after mount, so the opening month
  // is only known then. Move there once, and never fight the user afterwards.
  const [userMovedMonth, setUserMovedMonth] = useState(false);
  useEffect(() => {
    if (!userMovedMonth) setMonth(openingMonth);
  }, [openingMonth, userMovedMonth]);

  // Two months on desktop, one on mobile. Read after mount: deriving this from
  // window during render makes the server and client disagree on first paint.
  const [monthCount, setMonthCount] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setMonthCount(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Does the month on screen have anything left to sell?
  const visibleMonthIsFull = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const d = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (d >= todayStr && !blockedSet.has(d)) return false;
    }
    return true;
  }, [month, blockedSet, todayStr]);

  const nextOpenMonth = useMemo(() => {
    if (!visibleMonthIsFull) return null;
    const y = month.getFullYear();
    const m = month.getMonth();
    const nextStart = `${y}-${String(m + 1).padStart(2, "0")}-01`;
    const cursor = new Date(y, m + 1, 1);
    const after = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-01`;
    const found = firstAvailableMonth(blockedSet, after > todayStr ? after : todayStr);
    return found && found !== nextStart ? new Date(found + "T12:00:00") : null;
  }, [visibleMonthIsFull, month, blockedSet, todayStr]);

  const intlLocale = locale === "en" ? "en-US" : locale;
  const monthLabel = (d: Date) =>
    d.toLocaleDateString(intlLocale, { month: "long", year: "numeric" });
  // The shared formatDateDisplay() is fixed to en-US (correct for emails and the
  // admin), which would print "Sep 10, 2026" inside a Hebrew sentence. Format the
  // guest-facing summary in the language they're actually reading.
  const dayLabel = (d: Date) =>
    d.toLocaleDateString(intlLocale, { day: "numeric", month: "short", year: "numeric" });

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
        setError(t.book.datesUnavailable);
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
      setError(t.book.datesUnavailable);
      emit({ from: next.from, to: undefined }); // keep the check-in, let them re-pick check-out
      return;
    }
    emit(next);
  };

  const nights = range?.from && range?.to ? countNights(toStr(range.from), toStr(range.to)) : 0;

  return (
    <div className="booking-calendar" dir={isRtl ? "rtl" : "ltr"}>
      <style>{`.booking-calendar .day-unavailable { text-decoration: line-through; opacity: 0.45; }`}</style>

      {visibleMonthIsFull && (
        <div className="mb-4 rounded-sm border border-sand bg-ivory px-4 py-3 text-center text-sm text-graphite">
          <span>{(t.book.monthFull || "{month} is fully booked.").replace("{month}", monthLabel(month))}</span>
          {nextOpenMonth && (
            <button
              type="button"
              onClick={() => {
                setUserMovedMonth(true);
                setMonth(nextOpenMonth);
              }}
              className="ms-2 font-medium text-accent underline underline-offset-2 hover:text-accent-dark"
            >
              {(t.book.tryMonth || "Try {month}").replace("{month}", monthLabel(nextOpenMonth))}
            </button>
          )}
        </div>
      )}

      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        month={month}
        onMonthChange={(m) => {
          setUserMovedMonth(true);
          setMonth(m);
        }}
        startMonth={today}
        locale={DATE_LOCALES[locale] ?? enUS}
        dir={isRtl ? "rtl" : "ltr"}
        weekStartsOn={0} // Sunday-first (correct for Israel)
        disabled={{ before: today }}
        modifiers={{ unavailable: unavailableDates }}
        modifiersClassNames={{ unavailable: "day-unavailable" }}
        numberOfMonths={monthCount}
        showOutsideDays={false}
      />

      <p className="mt-3 text-center text-xs text-stone">
        {range?.from && !range?.to ? t.book.pickCheckout : t.book.pickDates}
      </p>

      {range?.from && range?.to && (
        <p className="mt-1 text-center text-sm text-graphite">
          {dayLabel(range.from)} → {dayLabel(range.to)} · {nights}{" "}
          {nights === 1 ? t.book.night : t.book.nights}
        </p>
      )}

      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
