import { useQuery } from "@tanstack/react-query";
import { getDailyMemory } from "@/features/diary/api/get-daily-memory.api";

export function useDailyMemory(date: string) {
  return useQuery({
    queryKey: ["diaries", "memory", date],
    queryFn: () => getDailyMemory(date),
  });
}
