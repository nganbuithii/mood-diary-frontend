import { useQuery } from "@tanstack/react-query";
import { getDiaryEntries } from "@/features/diary/api/diary.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function useDiaryEntries(month: string) {
  return useQuery({
    queryKey: diaryKeys.month(month),
    queryFn: () => getDiaryEntries(month),
  });
}
