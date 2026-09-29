import { useQuery } from "@tanstack/react-query";
import { getMoodStreak } from "@/features/diary/api/get-mood-streak.api";

export function useMoodStreak(date: string) {
  return useQuery({
    queryKey: ["diaries", "streak", date],
    queryFn: () => getMoodStreak(date),
  });
}
