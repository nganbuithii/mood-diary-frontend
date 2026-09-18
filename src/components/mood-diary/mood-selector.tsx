"use client";

import { cn } from "cn";

import { MOOD_OPTIONS, type Mood } from "@/components/mood-diary/mood.constants";

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="How are you feeling today?"
      className="flex flex-wrap justify-center gap-2 sm:gap-4"
    >
      {MOOD_OPTIONS.map((mood) => {
        const isSelected = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border border-transparent px-2 py-2 transition-all hover:-translate-y-0.5",
              isSelected && "border-border bg-surface shadow-sm",
            )}
          >
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-full text-2xl transition-transform sm:size-14 sm:text-3xl",
                mood.bgClass,
                isSelected &&
                  "scale-110 ring-2 ring-primary-hover ring-offset-2 ring-offset-background",
              )}
            >
              <span aria-hidden>{mood.emoji}</span>
            </span>
            <span
              className={cn(
                "text-xs text-muted-foreground",
                isSelected && "font-medium text-foreground",
              )}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
