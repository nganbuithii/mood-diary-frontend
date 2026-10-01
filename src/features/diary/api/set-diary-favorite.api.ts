import { apiClient } from "@/lib/api/api-client";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

export interface SetDiaryFavoriteRequest {
  date: string;
  isFavorite: boolean;
}

export async function setDiaryFavorite({
  date,
  isFavorite,
}: SetDiaryFavoriteRequest): Promise<DiaryEntryDto> {
  const { data } = await apiClient.patch<DiaryEntryDto>(`/diaries/${date}/favorite`, {
    isFavorite,
  });
  return data;
}
