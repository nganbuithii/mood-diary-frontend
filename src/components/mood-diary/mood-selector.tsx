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
      className="flex flex-wrap justify-center gap-3 sm:gap-4"
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
            className="group flex flex-col items-center gap-1.5 rounded-full border-0 outline-none transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:outline-none active:outline-none"
          >
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-full text-2xl transition-all sm:size-14 sm:text-3xl",
                mood.bgClass,
                isSelected
                  ? "scale-110 ring-2 ring-primary-hover ring-offset-2 ring-offset-surface"
                  : "group-hover:scale-105",
                "group-focus-visible:ring-2 group-focus-visible:ring-ring/60 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface",
              )}
            >
              <span aria-hidden>{mood.emoji}</span>
            </span>
            <span
              className={cn(
                "text-xs text-muted-foreground transition-colors",
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
