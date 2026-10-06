import { useInfiniteQuery } from "@tanstack/react-query";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";
import { getDiaryFeed } from "@/features/diary/api/get-diary-feed.api";
import { ApiError } from "@/lib/api/http-error";
import { isClientErrorStatus } from "@/lib/api/http-status";

const MAX_RETRIES = 3;

export function useDiaryFeed({ mood, month, favorite }: DiaryFeedFilters, limit = 12) {
  return useInfiniteQuery({
    queryKey: ["diaries", "feed", { mood, month, favorite, limit }],
    queryFn: ({ pageParam }) => getDiaryFeed({ mood, month, favorite, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && isClientErrorStatus(error.status)) &&
      failureCount < MAX_RETRIES,
  });
}
