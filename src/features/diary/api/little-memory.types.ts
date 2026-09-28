import type { Mood } from "@/components/mood-diary/mood.constants";
import type { Song } from "@/features/songs/types/song.types";

export interface LittleMemoryDto {
  id: string;
  mood: Mood;
  date: string;
  content: string;
  photoUrl: string | null;
  song: Song | null;
}
