import type { Mood } from "@/components/mood-diary/mood.constants";

export interface MoodStreakDayDto {
  date: string;
  mood: Mood | null;
  hasEntry: boolean;
}

export interface MoodStreakDto {
  currentStreak: number;
  longestStreak: number;
  week: MoodStreakDayDto[];
}
