import { useQuery } from "@tanstack/react-query";
import { getMoodStats } from "@/features/diary/api/diary.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function useMoodStats(month: string) {
  return useQuery({
    queryKey: diaryKeys.stats(month),
    queryFn: () => getMoodStats(month),
  });
}
