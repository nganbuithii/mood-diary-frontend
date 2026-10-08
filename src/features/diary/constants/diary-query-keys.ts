import type { DiaryFeedFilters } from "@/features/diary/types/diary-feed.types";

export const diaryKeys = {
  all: ["diaries"] as const,
  month: (month: string) => [...diaryKeys.all, "month", month] as const,
  feeds: () => [...diaryKeys.all, "feed"] as const,
  feed: (filters: DiaryFeedFilters & { limit: number }) => [...diaryKeys.feeds(), filters] as const,
  allStats: () => [...diaryKeys.all, "stats"] as const,
  stats: (month: string) => [...diaryKeys.allStats(), month] as const,
  streaks: () => [...diaryKeys.all, "streak"] as const,
  streak: (date: string) => [...diaryKeys.streaks(), date] as const,
  memories: () => [...diaryKeys.all, "memory"] as const,
  memory: (date: string) => [...diaryKeys.memories(), date] as const,
  setFavorite: () => [...diaryKeys.all, "set-favorite"] as const,
};
