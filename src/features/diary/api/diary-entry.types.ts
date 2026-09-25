import type { Mood } from "@/components/mood-diary/mood.constants";

export interface DiaryEntryDto {
  id: string;
  date: string;
  mood: Mood;
  note: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}
