"use client";

import { cn } from "cn";

import { ChartTooltip, useMarkTooltip } from "@/components/insights/chart-tooltip";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_OPTIONS } from "@/components/mood-diary/mood.constants";
import type { MoodPeriodStatsDto } from "@/features/diary/api/mood-stats.types";

function percent(count: number, total: number) {
  return Math.round((count / total) * 100);
}

function daysLabel(count: number) {
  return `${count} ${count === 1 ? "day" : "days"}`;
}

export function MoodBreakdown({ stats, monthLabel }: { stats: MoodPeriodStatsDto; monthLabel: string }) {
  const { containerRef, tooltip, bind } = useMarkTooltip();
  const total = stats.writtenDays;
  const segments = MOOD_OPTIONS.filter((mood) => stats.moodCounts[mood.value] > 0);

  if (total === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface/60 px-4 py-8 text-center text-sm text-muted-foreground">
        No pages in {monthLabel} yet, so there&apos;s nothing to count. Write a day and it shows up here ♡
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative">
        {/* 100% stacked bar. The 2px gaps show the card surface between segments. */}
        <div className="flex h-7 w-full gap-0.5" role="group" aria-label={`Mood mix for ${monthLabel}`}>
          {segments.map((mood, index) => {
            const count = stats.moodCounts[mood.value];
            const label = `${mood.label}: ${daysLabel(count)} (${percent(count, total)}%)`;
            return (
              <div
                key={mood.value}
                role="img"
                tabIndex={0}
                aria-label={label}
                {...bind(
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className={cn("size-2.5 rounded-[3px]", mood.chartBgClass)} />
                    <span className="font-medium">{mood.label}</span>
                    <span className="text-muted-foreground">
                      {daysLabel(count)} · {percent(count, total)}%
                    </span>
                  </span>,
                )}
                style={{ flexGrow: count, flexBasis: 0 }}
                className={cn(
                  "min-w-1.5 transition-[filter] outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  mood.chartBgClass,
                  index === 0 && "rounded-l-[4px]",
                  index === segments.length - 1 && "rounded-r-[4px]",
                )}
              />
            );
          })}
        </div>
        <ChartTooltip tooltip={tooltip} />
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
        {MOOD_OPTIONS.map((mood) => {
          const count = stats.moodCounts[mood.value];
          return (
            <li key={mood.value} className={cn("flex items-center gap-2", count === 0 && "opacity-50")}>
              <span aria-hidden className={cn("h-3 w-3 shrink-0 rounded-[3px]", mood.chartBgClass)} />
              <span aria-hidden className={cn("size-6 shrink-0 rounded-full p-0.5", mood.bgClass)}>
                <MoodFace mood={mood.value} />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm text-foreground">{mood.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {daysLabel(count)} · {percent(count, total)}%
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <details className="group text-sm">
        <summary className="w-fit cursor-pointer rounded-full text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/60">
          See the numbers
        </summary>
        <table className="mt-3 w-full max-w-sm text-left">
          <caption className="sr-only">Days per mood in {monthLabel}</caption>
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="py-1.5 font-medium">Mood</th>
              <th scope="col" className="py-1.5 text-right font-medium">Days</th>
              <th scope="col" className="py-1.5 text-right font-medium">Share</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {MOOD_OPTIONS.map((mood) => (
              <tr key={mood.value} className="border-b border-dashed border-border/60">
                <th scope="row" className="py-1.5 font-normal">{mood.label}</th>
                <td className="py-1.5 text-right">{stats.moodCounts[mood.value]}</td>
                <td className="py-1.5 text-right">{percent(stats.moodCounts[mood.value], total)}%</td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-1.5 font-medium">Total</th>
              <td className="py-1.5 text-right font-medium">{total}</td>
              <td className="py-1.5 text-right font-medium">100%</td>
            </tr>
          </tbody>
        </table>
      </details>
    </div>
  );
}
