import { useQuery } from "@tanstack/react-query";
import { getMoodStats } from "@/features/diary/api/get-mood-stats.api";

export function useMoodStats(month: string) {
  return useQuery({
    queryKey: ["diaries", "stats", month],
    queryFn: () => getMoodStats(month),
  });
}
