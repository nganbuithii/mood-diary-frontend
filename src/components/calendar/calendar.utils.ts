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

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const relativeTimeFormat = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export function formatRelativeDay(date: Date, today: Date): string {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((end.getTime() - start.getTime()) / DAY_MS);

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
