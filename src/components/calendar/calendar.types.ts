import type { Mood } from "@/components/mood-diary/mood.constants";

export interface DiaryEntry {
  date: string;
  mood: Mood;
  note?: string;
}
