import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { upsertDiaryEntry } from "@/features/diary/api/upsert-diary-entry.api";

export function useUpsertDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDiaryEntry,
    onSuccess: (savedEntry) => {
      const month = savedEntry.date.slice(0, 7);
      // Put the saved entry in the month cache right away so the UI can switch without waiting for a refetch.
      queryClient.setQueryData<DiaryEntryDto[]>(["diaries", month], (entries) => {
        if (!entries) return entries;
        const others = entries.filter((entry) => entry.date !== savedEntry.date);
        return [...others, savedEntry];
      });
      // Refresh everything derived from diary entries (month list, streak, recent memories, ...).
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
}
