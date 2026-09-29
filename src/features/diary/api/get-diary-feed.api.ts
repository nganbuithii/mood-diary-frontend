import { apiClient } from "@/lib/api/api-client";
import type { DiaryFeedPageDto, DiaryFeedQuery } from "@/features/diary/api/diary-feed.types";

export async function getDiaryFeed({
  mood,
  month,
  limit,
  cursor,
}: DiaryFeedQuery): Promise<DiaryFeedPageDto> {
  const { data } = await apiClient.get<DiaryFeedPageDto>("/diaries/feed", {
    params: { mood, month, limit, cursor },
  });
  return data;
}
