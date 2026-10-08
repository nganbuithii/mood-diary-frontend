import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import type { DiaryFeedPageDto } from "@/features/diary/api/diary-feed.types";
import { setDiaryFavorite } from "@/features/diary/api/set-diary-favorite.api";
import { diaryKeys, monthOfDateKey } from "@/features/diary/constants/diary-query-keys";
import { getErrorMessage } from "@/lib/api/http-error";

export function useSetDiaryFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: diaryKeys.setFavorite(),
    mutationFn: setDiaryFavorite,
    // Flip the heart in every cached feed and in the month calendar right away; roll back if the request fails.
    onMutate: async ({ date, isFavorite }) => {
      const monthKey = diaryKeys.month(monthOfDateKey(date));
      await Promise.all([
        queryClient.cancelQueries({ queryKey: diaryKeys.feeds() }),
        queryClient.cancelQueries({ queryKey: monthKey, exact: true }),
      ]);
      const previousFeeds = queryClient.getQueriesData<InfiniteData<DiaryFeedPageDto>>({
        queryKey: diaryKeys.feeds(),
      });
      const previousMonth = queryClient.getQueryData<DiaryEntryDto[]>(monthKey);
      const withFavorite = (entry: DiaryEntryDto) => (entry.date === date ? { ...entry, isFavorite } : entry);

      queryClient.setQueriesData<InfiniteData<DiaryFeedPageDto>>({ queryKey: diaryKeys.feeds() }, (feed) =>
        feed && {
          ...feed,
          pages: feed.pages.map((page) => ({
            ...page,
            items: page.items.map(withFavorite),
          })),
        },
      );
      queryClient.setQueryData<DiaryEntryDto[]>(monthKey, (entries) => entries?.map(withFavorite));

      return { previousFeeds, monthKey, previousMonth };
    },
    onError: (error, _variables, context) => {
      context?.previousFeeds.forEach(([queryKey, feed]) => queryClient.setQueryData(queryKey, feed));
      if (context) queryClient.setQueryData(context.monthKey, context.previousMonth);
      toast.error(getErrorMessage(error, "Couldn't update your favorites. Please try again."));
    },
    onSettled: (_data, _error, { date }) => {
      // With several hearts tapped in a row, refetching after the first one would overwrite the
      // optimistic state of the others, so only refetch once the last one has finished.
      if (queryClient.isMutating({ mutationKey: diaryKeys.setFavorite() }) > 1) return;
      queryClient.invalidateQueries({ queryKey: diaryKeys.feeds() });
      queryClient.invalidateQueries({ queryKey: diaryKeys.month(monthOfDateKey(date)), exact: true });
    },
  });
}
