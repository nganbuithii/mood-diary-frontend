export type Mood = "VERY_SAD" | "SAD" | "NEUTRAL" | "HAPPY" | "VERY_HAPPY";

export interface MoodMeta {
  value: Mood;
  emoji: string;
  label: string;
  bgClass: string;
  bgClassMuted: string;
}

export const MOOD_OPTIONS: MoodMeta[] = [
  {
    value: "VERY_SAD",
    emoji: "😭",
    label: "Terrible",
    bgClass: "bg-mood-very-sad",
    bgClassMuted: "bg-mood-very-sad/60",
  },
  {
    value: "SAD",
    emoji: "😔",
    label: "Blue",
    bgClass: "bg-mood-sad",
    bgClassMuted: "bg-mood-sad/60",
  },
  {
    value: "NEUTRAL",
    emoji: "😐",
    label: "Okay",
    bgClass: "bg-mood-neutral",
    bgClassMuted: "bg-mood-neutral/60",
  },
  {
    value: "HAPPY",
    emoji: "😊",
    label: "Happy",
    bgClass: "bg-mood-happy",
    bgClassMuted: "bg-mood-happy/60",
  },
  {
    value: "VERY_HAPPY",
    emoji: "🥰",
    label: "Loved",
    bgClass: "bg-mood-very-happy",
    bgClassMuted: "bg-mood-very-happy/60",
  },
];

export const MOOD_META: Record<Mood, MoodMeta> = Object.fromEntries(
  MOOD_OPTIONS.map((option) => [option.value, option]),
) as Record<Mood, MoodMeta>;
