import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAchievements, markAchievementSeen } from "@/features/achievements/api/achievements.api";
import { isKnownAchievement, isNewAchievement } from "@/features/achievements/constants/achievement.constants";
import { achievementKeys } from "@/features/achievements/constants/achievement-query-keys";
import type { AchievementsDto } from "@/features/achievements/types/achievement.types";
import { MINUTE_MS } from "@/lib/constants/time";
import { formatDateKey } from "@/lib/date";
import { useToday } from "@/lib/hooks/use-today";

export function useAchievements() {
  const today = formatDateKey(useToday());
  return useQuery({
    queryKey: achievementKeys.summary(today),
    queryFn: () => getAchievements(today),
    // Built from the whole account export, and diary changes invalidate it anyway.
    staleTime: 5 * MINUTE_MS,
  });
}

export function useNewAchievementCount() {
  const { data } = useAchievements();
  return data?.achievements.filter((item) => isKnownAchievement(item) && isNewAchievement(item)).length ?? 0;
}

export function useMarkAchievementSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAchievementSeen,
    onMutate: (id) => {
      queryClient.setQueriesData<AchievementsDto>({ queryKey: achievementKeys.all }, (summary) =>
        summary && {
          ...summary,
          achievements: summary.achievements.map((item) => (item.id === id ? { ...item, seenLevel: item.level } : item)),
        },
      );
    },
  });
}
