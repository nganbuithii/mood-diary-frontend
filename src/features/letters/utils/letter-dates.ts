import { OPENING_HOUR } from "@/features/letters/constants/letter.constants";
import { DAY_MS } from "@/lib/constants/time";

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

const MAX_DELIVERY_YEARS = 10;
const SHOW_DAYS_BELOW = 45;
const SHOW_MONTHS_BELOW = 550;
const DAYS_PER_MONTH = 30.4;
const DAYS_PER_YEAR = 365.25;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addMonthsClamped(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

/** The letter opens at OPENING_HOUR in the writer's own time zone; the browser knows it, so it's computed here. */
export function deliverAtFor(day: Date) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), OPENING_HOUR).toISOString();
}

export function earliestDeliveryDay(today = new Date()) {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}

export function latestDeliveryDay(today = new Date()) {
  return new Date(today.getFullYear() + MAX_DELIVERY_YEARS, today.getMonth(), today.getDate());
}

export function timeUntilLabel(deliverAt: string, now = new Date()) {
  const days = Math.round((startOfDay(new Date(deliverAt)).getTime() - startOfDay(now).getTime()) / DAY_MS);
  if (days < SHOW_DAYS_BELOW) return relative.format(days, "day");
  if (days < SHOW_MONTHS_BELOW) return relative.format(Math.round(days / DAYS_PER_MONTH), "month");
  return relative.format(Math.round(days / DAYS_PER_YEAR), "year");
}

export function opensInLabel(deliverAt: string, now = new Date()) {
  return `Opens ${timeUntilLabel(deliverAt, now)}`;
}

export function formatOpeningTime() {
  return new Date(2000, 0, 1, OPENING_HOUR).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
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
