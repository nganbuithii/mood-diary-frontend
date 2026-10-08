import { apiClient } from "@/lib/api/api-client";
import { SECOND_MS } from "@/lib/constants/time";
import type {
  DiaryEntryDto,
  SetDiaryFavoriteRequest,
  UpsertDiaryEntryRequest,
} from "@/features/diary/types/diary-entry.types";
import type { DiaryFeedPageDto, DiaryFeedQuery } from "@/features/diary/types/diary-feed.types";
import type { DailyMemoryResponseDto, LittleMemoryDto } from "@/features/diary/types/little-memory.types";
import type { MoodStatsDto } from "@/features/diary/types/mood-stats.types";
import type { MoodStreakDto } from "@/features/diary/types/mood-streak.types";

const UPSERT_WITH_PHOTOS_TIMEOUT_MS = 90 * SECOND_MS;

export async function getDiaryEntries(month: string): Promise<DiaryEntryDto[]> {
  const { data } = await apiClient.get<DiaryEntryDto[]>("/diaries", { params: { month } });
  return data;
}

export async function getDiaryFeed({ mood, month, favorite, limit, cursor }: DiaryFeedQuery): Promise<DiaryFeedPageDto> {
  const { data } = await apiClient.get<DiaryFeedPageDto>("/diaries/feed", {
    // Leave `favorite` out entirely unless it's on, so the API never sees `favorite=false`.
    params: { mood, month, favorite: favorite || undefined, limit, cursor },
  });
  return data;
}

export async function getMoodStats(month: string): Promise<MoodStatsDto> {
  const { data } = await apiClient.get<MoodStatsDto>("/diaries/stats", { params: { month } });
  return data;
}

export async function getMoodStreak(date: string): Promise<MoodStreakDto> {
  const { data } = await apiClient.get<MoodStreakDto>("/diaries/streak", { params: { date } });
  return data;
}

export async function getDailyMemory(date: string): Promise<LittleMemoryDto | null> {
  const { data } = await apiClient.get<DailyMemoryResponseDto>("/diaries/memory/today", { params: { date } });
  return data.memory;
}

export async function upsertDiaryEntry({
  date,
  mood,
  note,
  photos = [],
  songId,
}: UpsertDiaryEntryRequest): Promise<DiaryEntryDto> {
  const formData = new FormData();
  formData.append("date", date);
  formData.append("mood", mood);
  if (note) formData.append("note", note);
  photos.forEach((photo) => formData.append("photos", photo));
  if (songId !== undefined) formData.append("songId", songId);

  const { data } = await apiClient.post<DiaryEntryDto>("/diaries", formData, {
    headers: { "Content-Type": undefined },
    timeout: photos.length > 0 ? UPSERT_WITH_PHOTOS_TIMEOUT_MS : undefined,
  });
  return data;
}

export async function setDiaryFavorite({ date, isFavorite }: SetDiaryFavoriteRequest): Promise<DiaryEntryDto> {
  const { data } = await apiClient.patch<DiaryEntryDto>(`/diaries/${date}/favorite`, { isFavorite });
  return data;
}

export async function deleteDiaryEntry(date: string): Promise<void> {
  await apiClient.delete(`/diaries/${date}`);
}
