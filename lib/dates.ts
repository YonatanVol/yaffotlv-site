/** Timezone-aware date utilities for Asia/Jerusalem */

export const TZ = "Asia/Jerusalem";

/** Get today's date string in Jerusalem timezone: "YYYY-MM-DD" */
export function todayJerusalem(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Generate array of date strings for nights in [checkIn, checkOut) — checkOut is exclusive */
export function dateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const current = new Date(checkIn + "T12:00:00");
  const end = new Date(checkOut + "T12:00:00");
  while (current < end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Get day-of-week (0=Sun ... 4=Thu, 5=Fri, 6=Sat) for a date string in Jerusalem timezone */
export function getDayOfWeek(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00");
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: TZ,
  });
  const dayName = formatter.format(d);
  const map: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return map[dayName] ?? 0;
}

/** Check if a date is Thursday (4) or Friday (5) — premium rate days */
export function isWeekendRate(dateStr: string): boolean {
  const dow = getDayOfWeek(dateStr);
  return dow === 4 || dow === 5;
}

/** Add days to a date string, return "YYYY-MM-DD" */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Calculate number of nights between check-in and check-out */
export function countNights(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T12:00:00");
  const b = new Date(checkOut + "T12:00:00");
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/** Format a date string for display: "Mar 15, 2026" */
export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  });
}

/** Day name abbreviation array */
export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
