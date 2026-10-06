import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { upsertDiaryEntry } from "@/features/diary/api/upsert-diary-entry.api";
import {
  diaryKeys,
  invalidateDiaryEntryQueries,
  monthOfDateKey,
} from "@/features/diary/constants/diary-query-keys";

export function useUpsertDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDiaryEntry,
    onSuccess: (savedEntry) => {
      // Put the saved entry in the month cache right away so the UI can switch without waiting for a refetch.
      queryClient.setQueryData<DiaryEntryDto[]>(diaryKeys.month(monthOfDateKey(savedEntry.date)), (entries) => {
        if (!entries) return entries;
        const others = entries.filter((entry) => entry.date !== savedEntry.date);
        return [...others, savedEntry];
      });
      invalidateDiaryEntryQueries(queryClient, savedEntry.date);
    },
  });
}
