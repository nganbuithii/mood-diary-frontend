import { DAY_MS } from "@/lib/constants/time";

export function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from(
    { length: 42 },
    (_, index) =>
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      ),
  );
}

export function formatMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isAfterDay(a: Date, b: Date): boolean {
  return formatDateKey(a) > formatDateKey(b);
}

export function canOpenDay(date: Date, today: Date, hasEntry: boolean): boolean {
  if (isAfterDay(date, today)) return false;
  return hasEntry || isSameDay(date, today);
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function tryParseDateKey(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = parseDateKey(value);
  return formatDateKey(date) === value ? date : null;
}

export function tryParseMonthKey(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return null;
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date, monthOffset = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

const DATE_FORMATS = {
  month: { month: "long" },
  monthYear: { month: "long", year: "numeric" },
  weekday: { weekday: "long" },
  monthDay: { month: "long", day: "numeric" },
  shortMonthDay: { month: "short", day: "numeric" },
  shortDate: { month: "short", day: "numeric", year: "numeric" },
  longDate: { month: "long", day: "numeric", year: "numeric" },
  weekdayDate: { weekday: "short", month: "long", day: "numeric", year: "numeric" },
  fullDate: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  weekdayMonthDay: { weekday: "long", month: "long", day: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateFormat = keyof typeof DATE_FORMATS;

const dateFormatters = new Map<DateFormat, Intl.DateTimeFormat>();

export function formatDate(date: Date, format: DateFormat): string {
  let formatter = dateFormatters.get(format);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", DATE_FORMATS[format]);
    dateFormatters.set(format, formatter);
  }
  return formatter.format(date);
}

const relativeTimeFormat = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export function formatRelativeDay(date: Date, today: Date): string {
  const start = startOfDay(date);
  const end = startOfDay(today);
  const days = daysBetween(start, end);

  if (days < 7) return relativeTimeFormat.format(-days, "day");
  if (days < 30) return relativeTimeFormat.format(-Math.floor(days / 7), "week");

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth() -
    (end.getDate() < start.getDate() ? 1 : 0);
  if (months < 12) return relativeTimeFormat.format(-Math.max(months, 1), "month");
  return relativeTimeFormat.format(-Math.floor(months / 12), "year");
}
