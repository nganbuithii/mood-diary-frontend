import type { Mood } from "@/components/mood-diary/mood.constants";

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
