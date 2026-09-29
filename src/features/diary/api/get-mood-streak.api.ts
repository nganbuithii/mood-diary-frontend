import { apiClient } from "@/lib/api/api-client";
import type { MoodStreakDto } from "@/features/diary/api/mood-streak.types";

export async function getMoodStreak(date: string): Promise<MoodStreakDto> {
  const { data } = await apiClient.get<MoodStreakDto>("/diaries/streak", {
    params: { date },
  });
  return data;
}
