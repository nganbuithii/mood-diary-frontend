import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DiaryEntryDto } from "@/features/diary/types/diary-entry.types";
import { deleteDiaryEntry } from "@/features/diary/api/diary.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";
import { invalidateDiaryEntryQueries, monthOfDateKey } from "@/features/diary/utils/diary-cache";

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiaryEntry,
    onSuccess: (_data, date) => {
      queryClient.setQueryData<DiaryEntryDto[]>(diaryKeys.month(monthOfDateKey(date)), (entries) =>
        entries?.filter((entry) => entry.date !== date),
      );
      invalidateDiaryEntryQueries(queryClient, date);
    },
  });
}
