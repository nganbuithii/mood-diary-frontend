import { apiClient } from "@/lib/api/api-client";
import type { MoodStatsDto } from "@/features/diary/api/mood-stats.types";

export async function getMoodStats(month: string): Promise<MoodStatsDto> {
  const { data } = await apiClient.get<MoodStatsDto>("/diaries/stats", {
    params: { month },
  });
  return data;
}
