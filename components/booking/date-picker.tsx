"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

interface BookingDatePickerProps {
  blockedDates: string[];
  onRangeSelect: (range: { checkIn: string; checkOut: string } | null) => void;
}

export function BookingDatePicker({ blockedDates, onRangeSelect }: BookingDatePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  const disabledDates = blockedDates.map((d) => new Date(d + "T12:00:00"));

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
    <div className="booking-calendar">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={[{ before: new Date() }, ...disabledDates]}
        numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
        showOutsideDays={false}
      />
    </div>
  );
}
