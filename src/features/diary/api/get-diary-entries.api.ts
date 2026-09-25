import { apiClient } from "@/lib/api/api-client";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

export async function getDiaryEntries(month: string): Promise<DiaryEntryDto[]> {
  const { data } = await apiClient.get<DiaryEntryDto[]>("/diaries", {
    params: { month },
  });
  return data;
}
