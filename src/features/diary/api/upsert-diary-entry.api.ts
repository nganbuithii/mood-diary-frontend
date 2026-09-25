import { apiClient } from "@/lib/api/api-client";
import type { Mood } from "@/components/mood-diary/mood.constants";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

export interface UpsertDiaryEntryRequest {
  date: string;
  mood: Mood;
  note?: string;
}

export async function upsertDiaryEntry(
  input: UpsertDiaryEntryRequest,
): Promise<DiaryEntryDto> {
  const { data } = await apiClient.post<DiaryEntryDto>("/diaries", input);
  return data;
}
