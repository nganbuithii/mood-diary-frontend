import { useQuery } from "@tanstack/react-query";
import { getDailyMemory } from "@/features/diary/api/get-daily-memory.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function useDailyMemory(date: string) {
  return useQuery({
    queryKey: diaryKeys.memory(date),
    queryFn: () => getDailyMemory(date),
  });
}
