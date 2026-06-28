"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { he, ar, enUS, ru, fr, es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useI18n } from "@/lib/i18n/context";
import { todayJerusalem } from "@/lib/dates";

// Map the site locale to a date-fns locale for localized month/day names.
const DATE_LOCALES: Record<string, typeof enUS> = { he, ar, en: enUS, ru, fr, es };

interface BookingDatePickerProps {
  blockedDates: string[];
  onRangeSelect: (range: { checkIn: string; checkOut: string } | null) => void;
}

export function BookingDatePicker({ blockedDates, onRangeSelect }: BookingDatePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const { locale, isRtl } = useI18n();

  const disabledDates = blockedDates.map((d) => new Date(d + "T12:00:00"));
  // Always open on the CURRENT month in Jerusalem time, and forbid navigating earlier.
  const today = new Date(todayJerusalem() + "T12:00:00");

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      const checkIn = newRange.from.toLocaleDateString("en-CA");
      const checkOut = newRange.to.toLocaleDateString("en-CA");
      onRangeSelect({ checkIn, checkOut });
    } else {
      onRangeSelect(null);
    }
  };

  return (
    <div className="booking-calendar" dir={isRtl ? "rtl" : "ltr"}>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        defaultMonth={today}
        startMonth={today}
        locale={DATE_LOCALES[locale] ?? enUS}
        dir={isRtl ? "rtl" : "ltr"}
        weekStartsOn={0} // Sunday-first (correct for Israel)
        disabled={[{ before: today }, ...disabledDates]}
        numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
        showOutsideDays={false}
      />
    </div>
  );
}
