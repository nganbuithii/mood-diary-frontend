import { useQuery } from "@tanstack/react-query";
import { getMoodStreak } from "@/features/diary/api/get-mood-streak.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function useMoodStreak(date: string) {
  return useQuery({
    queryKey: diaryKeys.streak(date),
    queryFn: () => getMoodStreak(date),
  });
}
