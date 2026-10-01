import type { Mood } from "@/components/mood-diary/mood.constants";

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
