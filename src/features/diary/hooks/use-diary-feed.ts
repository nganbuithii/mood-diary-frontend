import { useInfiniteQuery } from "@tanstack/react-query";
import type { DiaryFeedFilters } from "@/features/diary/types/diary-feed.types";
import { getDiaryFeed } from "@/features/diary/api/diary.api";
import { diaryKeys } from "@/features/diary/constants/diary-query-keys";

export function useDiaryFeed({ mood, month, favorite }: DiaryFeedFilters, limit = 12) {
  return useInfiniteQuery({
    queryKey: diaryKeys.feed({ mood, month, favorite, limit }),
    queryFn: ({ pageParam }) => getDiaryFeed({ mood, month, favorite, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
