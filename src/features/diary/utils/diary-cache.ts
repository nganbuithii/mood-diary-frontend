import type { QueryClient } from "@tanstack/react-query";

import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function monthOfDateKey(date: string) {
  return date.slice(0, 7);
}

export function invalidateDiaryEntryQueries(queryClient: QueryClient, date: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: diaryKeys.month(monthOfDateKey(date)), exact: true }),
    queryClient.invalidateQueries({ queryKey: diaryKeys.feeds() }),
    queryClient.invalidateQueries({ queryKey: diaryKeys.allStats() }),
    queryClient.invalidateQueries({ queryKey: diaryKeys.streaks() }),
    queryClient.invalidateQueries({ queryKey: diaryKeys.memories() }),
  ]);
}
