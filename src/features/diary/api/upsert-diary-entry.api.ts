import { apiClient } from "@/lib/api/api-client";
import type { Mood } from "@/components/mood-diary/mood.constants";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

const UPSERT_WITH_PHOTOS_TIMEOUT_MS = 90_000;

export interface UpsertDiaryEntryRequest {
  date: string;
  mood: Mood;
  note?: string;
  photos?: File[];
  songId?: string;
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
