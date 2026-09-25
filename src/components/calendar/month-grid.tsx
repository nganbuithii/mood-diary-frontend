"use client";

import { Plus } from "lucide-react";
import { cn } from "cn";

import { MOOD_META } from "@/components/mood-diary/mood.constants";
import { formatDateKey, isSameDay } from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";
import { MoodFace } from "@/components/mood-diary/mood-face";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthGridProps {
  days: Date[];
  currentMonth: number;
  today: Date;
  entries: Record<string, DiaryEntry>;
  onSelectDay: (date: Date) => void;
}

export function MonthGrid({
  days,
  currentMonth,
  today,
  entries,
  onSelectDay,
}: MonthGridProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm">
      <div className="grid grid-cols-7 border-b border-border/70 bg-accent-blue/15">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase sm:text-sm"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid auto-rows-fr grid-cols-7">
        {days.map((date) => {
          const key = formatDateKey(date);
          const entry = entries[key];
          const meta = entry ? MOOD_META[entry.mood] : null;
          const inCurrentMonth = date.getMonth() === currentMonth;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={key}
              type="button"
              disabled={!inCurrentMonth}
              onClick={() => onSelectDay(date)}
              className={cn(
                "group relative flex min-h-20 min-w-0 flex-col items-start gap-1.5 overflow-hidden border-r border-b border-dashed border-border/60 p-1.5 text-left transition-colors last:border-r-0 hover:bg-primary/5 focus-visible:z-10 focus-visible:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset disabled:cursor-default disabled:hover:bg-transparent sm:p-2.5 md:min-h-28",
                !inCurrentMonth && "bg-muted/20 text-muted-foreground/50",
                isToday && "bg-primary/5",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-heading text-base transition-colors",
                  isToday
                    ? "bg-primary-hover text-primary-foreground shadow-sm"
                    : "text-foreground/80 group-hover:bg-surface",
                )}
              >
                {date.getDate()}
              </span>

              {meta ? (
                <>
                  <span
                    className={cn(
                      "mx-auto size-7 shrink-0 rounded-full shadow-sm transition-transform group-hover:-translate-y-0.5 sm:size-8 md:hidden",
                      meta.bgClass,
                    )}
                  >
                    <MoodFace mood={meta.value} />
                    <span className="sr-only">{meta.label}</span>
                  </span>

                  <span
                    className={cn(
                      "hidden w-full min-w-0 flex-col gap-0.5 rounded-xl px-1.5 py-1 text-left shadow-sm transition-transform group-hover:-translate-y-0.5 md:flex",
                      meta.bgClassMuted,
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-1 text-xs font-medium text-foreground">
                      <span className={cn("size-5 shrink-0 rounded-full", meta.bgClass)}>
                        <MoodFace mood={meta.value} />
                      </span>
                      <span className="truncate">{meta.label}</span>
                    </span>
                    {entry?.note && (
                      <span className="line-clamp-1 text-[0.7rem] text-foreground/70">
                        {entry.note}
                      </span>
                    )}
                  </span>
                </>
              ) : (
                inCurrentMonth && (
                  <span
                    aria-hidden
                    className="absolute right-1.5 bottom-1.5 flex size-6 items-center justify-center rounded-full border border-dashed border-primary/30 text-primary-hover opacity-40 transition-all group-hover:scale-110 group-hover:border-solid group-hover:bg-primary/10 group-hover:opacity-100 sm:right-2 sm:bottom-2"
                  >
                    <Plus className="size-3.5" />
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
