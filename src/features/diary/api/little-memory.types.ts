import type { Mood } from "@/features/diary/types/mood.types";

export interface LittleMemoryDto {
  id: string;
  mood: Mood;
  entryDate: string;
  relativeLabel: string;
  content: string | null;
  photoUrl: string | null;
}

export interface DailyMemoryResponseDto {
  memory: LittleMemoryDto | null;
}
