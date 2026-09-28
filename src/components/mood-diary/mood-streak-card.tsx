import { cn } from "cn";

import { Card } from "@/components/ui/card";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import {
  formatDateKey,
  isAfterDay,
  parseDateKey,
} from "@/components/calendar/calendar.utils";
import type { MoodStreakDto } from "@/features/diary/api/mood-streak.types";

interface MoodStreakCardProps {
  streak: MoodStreakDto;
  today?: Date;
}

export function MoodStreakCard({ streak, today = new Date() }: MoodStreakCardProps) {
  const { currentStreak, longestStreak, week } = streak;
  const todayKey = formatDateKey(today);
  const hasStreak = currentStreak > 0;

  return (
    <Card className="rounded-lg px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-1.5 font-heading text-xl text-foreground">
          <span aria-hidden>{hasStreak ? "🔥" : "🌱"}</span>
          {hasStreak
            ? `${currentStreak}-day streak`
            : "Start your streak today"}
        </h2>
        {longestStreak > 0 && (
          <span className="text-xs text-muted-foreground">
            Longest: {longestStreak} day{longestStreak === 1 ? "" : "s"} <span aria-hidden>♡</span>
          </span>
        )}
      </div>

      <ol aria-label="This week" className="grid grid-cols-7 gap-1 sm:gap-2">
        {week.map((day) => {
          const date = parseDateKey(day.date);
          const isToday = day.date === todayKey;
          const isFuture = isAfterDay(date, today);
          const meta = day.hasEntry && day.mood ? MOOD_META[day.mood] : null;
          const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
          const status = meta ? meta.label : isFuture ? "Upcoming" : "No entry";

          return (
            <li key={day.date} className="flex flex-col items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "text-xs font-medium text-muted-foreground",
                  isToday && "text-primary-hover",
                )}
              >
                {weekday.charAt(0)}
              </span>

              <span
                aria-hidden
                className={cn(
                  "flex aspect-square w-full max-w-10 items-center justify-center rounded-full",
                  meta
                    ? cn("shadow-sm", meta.bgClass)
                    : "border-2 border-dashed border-border",
                  isFuture && "opacity-50",
                  isToday && "ring-2 ring-primary-hover/60 ring-offset-2 ring-offset-surface",
                )}
              >
                {meta && <MoodFace mood={meta.value} />}
              </span>

              <span className="sr-only">
                {weekday}
                {isToday ? " (today)" : ""}: {status}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
