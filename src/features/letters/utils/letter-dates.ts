const DAY_MS = 86_400_000;
const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export const OPENING_HOUR = 8;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addMonthsClamped(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

/** The letter opens at 8:00 in the writer's own time zone; the browser knows it, so it's computed here. */
export function deliverAtFor(day: Date) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), OPENING_HOUR).toISOString();
}

export function earliestDeliveryDay(today = new Date()) {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}

export function latestDeliveryDay(today = new Date()) {
  return new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());
}

export function opensInLabel(deliverAt: string, now = new Date()) {
  const days = Math.round((startOfDay(new Date(deliverAt)).getTime() - startOfDay(now).getTime()) / DAY_MS);
  if (days < 45) return `Opens ${relative.format(days, "day")}`;
  if (days < 550) return `Opens ${relative.format(Math.round(days / 30.4), "month")}`;
  return `Opens ${relative.format(Math.round(days / 365.25), "year")}`;
}

export function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function toDateInputValue(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromDateInputValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 ? date : null;
}

export function journeyProgress(createdAt: string, deliverAt: string, now = new Date()) {
  const start = new Date(createdAt).getTime();
  const end = new Date(deliverAt).getTime();
  if (end <= start) return 1;
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}

export function daysToGo(deliverAt: string, now = new Date()) {
  return Math.max(0, Math.round((startOfDay(new Date(deliverAt)).getTime() - startOfDay(now).getTime()) / DAY_MS));
}
