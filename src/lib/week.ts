// Small date helpers for the volunteer weekly calendar/summary — no date
// library is installed in this repo, and the range logic here is simple
// enough not to warrant adding one.

const WEEK_START_DAY = 0; // Sunday

export type WeekRange = { start: Date; end: Date };

/** Sunday–Saturday range (local time) containing `date`, shifted by `weekOffset` weeks. */
export function getWeekRange(date: Date, weekOffset = 0): WeekRange {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const diffToWeekStart = start.getDay() - WEEK_START_DAY;
  start.setDate(start.getDate() - diffToWeekStart + weekOffset * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function isWithinRange(date: Date, range: WeekRange): boolean {
  return date >= range.start && date <= range.end;
}

export function formatWeekRangeLabel(range: WeekRange): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(range.start)} – ${formatter.format(range.end)}`;
}

/** Hours between two "HH:MM" time-of-day strings, e.g. "09:00" -> "11:30" = 2.5. */
export function hoursBetween(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  return Math.max(0, endMinutes - startMinutes) / 60;
}

export function getWeekDays(range: WeekRange): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(range.start);
    day.setDate(day.getDate() + i);
    return day;
  });
}

export function formatHours(hours: number): string {
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
