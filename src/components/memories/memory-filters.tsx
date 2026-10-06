"use client";

import { Heart } from "lucide-react";
import { cn } from "cn";

import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_OPTIONS } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";
import { formatMonthKey } from "@/lib/date";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";

const MONTHS_TO_OFFER = 12;

function getRecentMonths(today = new Date()) {
  return Array.from({ length: MONTHS_TO_OFFER }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    return {
      value: formatMonthKey(date),
      label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  });
}

interface MemoryFiltersProps {
  value: DiaryFeedFilters;
  onChange: (filters: DiaryFeedFilters) => void;
}

export function MemoryFilters({ value, onChange }: MemoryFiltersProps) {
  const months = getRecentMonths();
  const chipClass =
    "flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

  const selectMood = (mood: Mood | undefined) => onChange({ ...value, mood });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="radiogroup"
        aria-label="Filter by mood"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
      >
        <button
          type="button"
          role="radio"
          aria-checked={!value.mood}
          onClick={() => selectMood(undefined)}
          className={cn(
            chipClass,
            !value.mood
              ? "border-primary/60 bg-primary/15 font-medium text-foreground"
              : "border-border bg-surface text-muted-foreground hover:text-foreground",
          )}
        >
          All moods
        </button>
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = value.mood === mood.value;
          return (
            <button
              key={mood.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => selectMood(isSelected ? undefined : mood.value)}
              className={cn(
                chipClass,
                "pl-1",
                isSelected
                  ? "border-primary/60 bg-primary/15 font-medium text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              <span className={cn("size-6 rounded-full p-0.5", mood.bgClass)}>
                <MoodFace mood={mood.value} />
              </span>
              {mood.label}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-pressed={Boolean(value.favorite)}
          onClick={() => onChange({ ...value, favorite: value.favorite ? undefined : true })}
          className={cn(
            chipClass,
            value.favorite
              ? "border-primary/60 bg-primary/15 font-medium text-foreground"
              : "border-border bg-surface text-muted-foreground hover:text-foreground",
          )}
        >
          <Heart
            aria-hidden
            className={cn("size-4", value.favorite && "text-primary-hover")}
            fill={value.favorite ? "currentColor" : "none"}
          />
          Favorites
        </button>

        <label className="flex flex-1 items-center gap-2 text-sm text-muted-foreground sm:flex-none">
          <span className="sr-only sm:not-sr-only">Month</span>
          <select
            value={value.month ?? ""}
            onChange={(event) => onChange({ ...value, month: event.target.value || undefined })}
            className="h-8 w-full rounded-full border border-border bg-surface px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:w-auto"
          >
            <option value="">All time</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
