import type { Mood } from "@/features/diary/types/mood.types";

export interface MoodPeriodStatsDto {
  month: string;
  daysInMonth: number;
  writtenDays: number;
  moodCounts: Record<Mood, number>;
  topMood: Mood | null;
  averageScore: number | null;
}

export interface MoodStatsDto extends MoodPeriodStatsDto {
  previous: MoodPeriodStatsDto;
}
