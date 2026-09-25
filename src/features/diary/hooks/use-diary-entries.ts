import { useQuery } from "@tanstack/react-query";
import { getDiaryEntries } from "@/features/diary/api/get-diary-entries.api";

export function useDiaryEntries(month: string) {
  return useQuery({
    queryKey: ["diaries", month],
    queryFn: () => getDiaryEntries(month),
  });
}
