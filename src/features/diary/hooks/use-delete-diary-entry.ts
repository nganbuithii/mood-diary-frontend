import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { deleteDiaryEntry } from "@/features/diary/api/delete-diary-entry.api";

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiaryEntry,
    onSuccess: (_data, date) => {
      queryClient.setQueryData<DiaryEntryDto[]>(["diaries", date.slice(0, 7)], (entries) =>
        entries?.filter((entry) => entry.date !== date),
      );
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
}
