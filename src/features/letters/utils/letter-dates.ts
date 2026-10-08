import { OPENING_HOUR } from "@/features/letters/constants/letter.constants";
import { daysBetween } from "@/lib/date";

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

const MAX_DELIVERY_YEARS = 10;
const DEFAULT_DELIVERY_MONTHS = 12;
const SHOW_DAYS_BELOW = 45;
const SHOW_MONTHS_BELOW = 550;
const DAYS_PER_MONTH = 30.4;
const DAYS_PER_YEAR = 365.25;

export function addMonthsClamped(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

export function defaultDeliveryDay(today: Date) {
  return addMonthsClamped(today, DEFAULT_DELIVERY_MONTHS);
}

export function deliverAtFor(day: Date) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), OPENING_HOUR).toISOString();
}

export function earliestDeliveryDay(today: Date) {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}

export function latestDeliveryDay(today: Date) {
  return new Date(today.getFullYear() + MAX_DELIVERY_YEARS, today.getMonth(), today.getDate());
}

export function timeUntilLabel(deliverAt: string, now: Date) {
  const days = daysBetween(now, new Date(deliverAt));
  if (days < SHOW_DAYS_BELOW) return relative.format(days, "day");
  if (days < SHOW_MONTHS_BELOW) return relative.format(Math.round(days / DAYS_PER_MONTH), "month");
  return relative.format(Math.round(days / DAYS_PER_YEAR), "year");
}

export function opensInLabel(deliverAt: string, now: Date) {
  return `Opens ${timeUntilLabel(deliverAt, now)}`;
}

export function formatOpeningTime() {
  return new Date(2000, 0, 1, OPENING_HOUR).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function journeyProgress(createdAt: string, deliverAt: string, now: Date) {
  const start = new Date(createdAt).getTime();
  const end = new Date(deliverAt).getTime();
  if (end <= start) return 1;
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}

export function daysToGo(deliverAt: string, now: Date) {
  return Math.max(0, daysBetween(now, new Date(deliverAt)));
}
