import { useInfiniteQuery } from "@tanstack/react-query";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";
import { getDiaryFeedMock } from "@/features/diary/mocks/diary-feed.mock";

export function useDiaryFeed({ mood, month }: DiaryFeedFilters, limit = 12) {
  return useInfiniteQuery({
    queryKey: ["diaries", "feed", { mood, month, limit }],
    queryFn: ({ pageParam }) => getDiaryFeedMock({ mood, month, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
