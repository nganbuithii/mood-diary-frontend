import type { Mood } from "@/components/mood-diary/mood.constants";
import type { Song } from "@/features/songs/types/song.types";

export interface DiaryEntryDto {
  id: string;
  date: string;
  mood: Mood;
  note: string | null;
  photoUrls: string[];
  song: Song | null;
  createdAt: string;
  updatedAt: string;
}
