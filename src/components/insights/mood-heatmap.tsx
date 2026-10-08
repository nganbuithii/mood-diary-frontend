"use client";

import Link from "next/link";
import { cn } from "cn";

import { ChartTooltip, useMarkTooltip } from "@/components/insights/chart-tooltip";
import { MOOD_META, MOOD_OPTIONS } from "@/components/mood-diary/mood.constants";
import { formatDate, formatDateKey, isAfterDay } from "@/lib/date";
import type { DiaryEntryDto } from "@/features/diary/types/diary-entry.types";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface MoodHeatmapProps {
  month: Date;
  entries: DiaryEntryDto[];
  today: Date;
}

export function MoodHeatmap({ month, entries, today }: MoodHeatmapProps) {
  const { containerRef, tooltip, bind } = useMarkTooltip();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = new Date(year, monthIndex, 1).getDay();
  const byDate = new Map(entries.map((entry) => [entry.date, entry]));

  return (
    <div className="flex flex-col gap-3">
      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEKDAYS.map((label, index) => (
            <span key={index} aria-hidden className="pb-1 text-center text-xs font-medium text-muted-foreground">
              {label}
            </span>
          ))}

          {Array.from({ length: leadingBlanks }, (_, index) => (
            <span key={`blank-${index}`} aria-hidden />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const date = new Date(year, monthIndex, index + 1);
            const key = formatDateKey(date);
            const entry = byDate.get(key);
            const meta = entry ? MOOD_META[entry.mood] : null;
            const isFuture = isAfterDay(date, today);
            const longDate = formatDate(date, "monthDay");
            const label = `${longDate}: ${meta ? meta.label : isFuture ? "still ahead" : "no page"}`;

            const cellClass = cn(
              "relative flex aspect-square items-start justify-start rounded-[6px] p-1 text-[0.65rem] leading-none tabular-nums transition-[filter,transform] outline-none sm:p-1.5 sm:text-xs",
              meta
                ? cn(meta.chartBgClass, "hover:brightness-110")
                : "border border-dashed border-border/70 bg-muted/30 text-muted-foreground",
              isFuture && "opacity-40",
            );
            
            const dayNumber = (
              <span className={cn(meta && "rounded-full bg-surface/85 px-1 py-0.5 text-foreground")}>{index + 1}</span>
            );

            if (isFuture) {
              return (
                <span key={key} role="img" aria-label={label} className={cellClass}>
                  {dayNumber}
                </span>
              );
            }

            return (
              <Link
                key={key}
                href={`/diary?date=${key}`}
                aria-label={`${label}. Open this day in your diary`}
                {...bind(
                  <span className="flex items-center gap-1.5">
                    {meta && <span aria-hidden className={cn("size-2.5 rounded-[3px]", meta.chartBgClass)} />}
                    <span className="font-medium">{longDate}</span>
                    <span className="text-muted-foreground">{meta ? meta.label : "No page"}</span>
                  </span>,
                )}
                className={cn(
                  cellClass,
                  "hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:hover:translate-y-0",
                )}
              >
                {dayNumber}
              </Link>
            );
          })}
        </div>
        <ChartTooltip tooltip={tooltip} />
      </div>

      <ul aria-label="Legend" className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        {MOOD_OPTIONS.map((mood) => (
          <li key={mood.value} className="flex items-center gap-1.5">
            <span aria-hidden className={cn("size-3 rounded-[3px]", mood.chartBgClass)} />
            {mood.label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[3px] border border-dashed border-border/70 bg-muted/30" />
          No page
        </li>
      </ul>
    </div>
  );
}
