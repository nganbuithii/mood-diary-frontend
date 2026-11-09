import { apiClient } from "@/lib/api/api-client";
import type { AchievementsDto } from "@/features/achievements/types/achievement.types";

export async function getAchievements(date: string): Promise<AchievementsDto> {
  const { data } = await apiClient.get<AchievementsDto>("/achievements", { params: { date } });
  return data;
}

export async function markAchievementSeen(id: string): Promise<void> {
  await apiClient.post(`/achievements/${id}/seen`);
}
