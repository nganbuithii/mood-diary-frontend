import { apiClient } from "@/lib/api/api-client";
import type { DiaryFeedPageDto, DiaryFeedQuery } from "@/features/diary/api/diary-feed.types";

export async function getDiaryFeed({
  mood,
  month,
  favorite,
  limit,
  cursor,
}: DiaryFeedQuery): Promise<DiaryFeedPageDto> {
  const { data } = await apiClient.get<DiaryFeedPageDto>("/diaries/feed", {
    // Leave `favorite` out entirely unless it's on, so the API never sees `favorite=false`.
    params: { mood, month, favorite: favorite || undefined, limit, cursor },
  });
  return data;
}
