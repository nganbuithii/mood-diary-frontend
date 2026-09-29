import { useInfiniteQuery } from "@tanstack/react-query";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";
import { getDiaryFeed } from "@/features/diary/api/get-diary-feed.api";
import { ApiError } from "@/lib/api/http-error";

const MAX_RETRIES = 3;

export function useDiaryFeed({ mood, month }: DiaryFeedFilters, limit = 12) {
  return useInfiniteQuery({
    queryKey: ["diaries", "feed", { mood, month, limit }],
    queryFn: ({ pageParam }) => getDiaryFeed({ mood, month, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
      failureCount < MAX_RETRIES,
  });
}
