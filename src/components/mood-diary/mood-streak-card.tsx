import { cn } from "cn";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";
import {
  formatDateKey,
  formatMonthKey,
  isAfterDay,
} from "@/lib/date";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useMoodStreak } from "@/features/diary/hooks/use-mood-streak";
import { useToday } from "@/lib/hooks/use-today";

interface WeekDay {
  date: Date;
  key: string;
  mood: Mood | null;
}

// Monday → Sunday of the week containing `today`.
function getWeekDates(today: Date): Date[] {
  const mondayOffset = (today.getDay() + 6) % 7;
  return Array.from(
    { length: 7 },
    (_, index) =>
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset + index),
  );
}

export function MoodStreakCard() {
  const today = useToday();
  const todayKey = formatDateKey(today);
  const weekDates = getWeekDates(today);
  const { data: streak, isPending } = useMoodStreak(todayKey);

  const { data: firstMonthEntries } = useDiaryEntries(formatMonthKey(weekDates[0]));
  const { data: lastMonthEntries } = useDiaryEntries(formatMonthKey(weekDates[6]));
  const moodByDate = new Map(
    [...(firstMonthEntries ?? []), ...(lastMonthEntries ?? [])].map((entry) => [
      entry.date,
      entry.mood,
    ]),
  );
  const week: WeekDay[] = weekDates.map((date) => {
    const key = formatDateKey(date);
    return { date, key, mood: moodByDate.get(key) ?? null };
  });

  if (isPending) {
    return (
      <Card className="items-center rounded-lg px-5">
        <Spinner className="my-6" />
      </Card>
    );
  }

  if (!streak) return null;

  const { current, longest, writtenToday } = streak;
  const hasStreak = current > 0;

  return (
    <Card className="rounded-lg px-5">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="flex items-center gap-1.5 font-heading text-xl text-foreground">
            <span aria-hidden>{hasStreak ? "🔥" : "🌱"}</span>
            {hasStreak ? `${current}-day streak` : "Start your streak today"}
          </h2>
          {longest > 0 && (
            <span className="text-xs text-muted-foreground">
              Longest: {longest} day{longest === 1 ? "" : "s"} <span aria-hidden>♡</span>
            </span>
          )}
        </div>
        
        {hasStreak && !writtenToday && (
          <p className="text-xs text-muted-foreground">
            Write today to keep it going <span aria-hidden>♡</span>
          </p>
        )}
      </div>

      <ol aria-label="This week" className="grid grid-cols-7 gap-1 sm:gap-2">
        {week.map((day) => {
          const isToday = day.key === todayKey;
          const isFuture = isAfterDay(day.date, today);
          const meta = day.mood ? MOOD_META[day.mood] : null;
          const weekday = day.date.toLocaleDateString("en-US", { weekday: "long" });
          const status = meta ? meta.label : isFuture ? "Upcoming" : "No entry";

          return (
            <li key={day.key} className="flex flex-col items-center gap-1.5">
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
