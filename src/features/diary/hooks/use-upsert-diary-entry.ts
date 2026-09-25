import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertDiaryEntry } from "@/features/diary/api/upsert-diary-entry.api";

export function useUpsertDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertDiaryEntry,
    onSuccess: (_data, variables) => {
      const month = variables.date.slice(0, 7);
      queryClient.invalidateQueries({ queryKey: ["diaries", month] });
    },
  });
}
