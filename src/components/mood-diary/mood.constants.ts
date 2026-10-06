import type { Mood } from "@/features/diary/types/mood.types";

export interface MoodMeta {
  value: Mood;
  label: string;
  bgClass: string;
  bgClassMuted: string;
  chartBgClass: string;
}

export const MOOD_OPTIONS: MoodMeta[] = [
  {
    value: "VERY_SAD",
    label: "Terrible",
    bgClass: "bg-mood-very-sad",
    bgClassMuted: "bg-mood-very-sad/60",
    chartBgClass: "bg-chart-mood-very-sad",
  },
  {
    value: "SAD",
    label: "Blue",
    bgClass: "bg-mood-sad",
    bgClassMuted: "bg-mood-sad/60",
    chartBgClass: "bg-chart-mood-sad",
  },
  {
    value: "NEUTRAL",
    label: "Okay",
    bgClass: "bg-mood-neutral",
    bgClassMuted: "bg-mood-neutral/60",
    chartBgClass: "bg-chart-mood-neutral",
  },
  {
    value: "HAPPY",
    label: "Happy",
    bgClass: "bg-mood-happy",
    bgClassMuted: "bg-mood-happy/60",
    chartBgClass: "bg-chart-mood-happy",
  },
  {
    value: "VERY_HAPPY",
    label: "Loved",
    bgClass: "bg-mood-very-happy",
    bgClassMuted: "bg-mood-very-happy/60",
    chartBgClass: "bg-chart-mood-very-happy",
  },
];

export const MOOD_META: Record<Mood, MoodMeta> = Object.fromEntries(
  MOOD_OPTIONS.map((option) => [option.value, option]),
) as Record<Mood, MoodMeta>;
