import type { Mood } from "@/components/mood-diary/mood.constants";
import type { Song } from "@/features/songs/types/song.types";

export interface DiaryEntry {
  date: string;
  mood: Mood;
  note?: string;
  photoUrls: string[];
  song: Song | null;
}
