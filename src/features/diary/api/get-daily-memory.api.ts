import { apiClient } from "@/lib/api/api-client";
import type {
  DailyMemoryResponseDto,
  LittleMemoryDto,
} from "@/features/diary/api/little-memory.types";

export async function getDailyMemory(date: string): Promise<LittleMemoryDto | null> {
  const { data } = await apiClient.get<DailyMemoryResponseDto>("/diaries/memory/today", {
    params: { date },
  });
  return data.memory;
}
