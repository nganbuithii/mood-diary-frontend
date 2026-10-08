import type { Mood } from "@/features/diary/types/mood.types";
import type { Song } from "@/features/songs/types/song.types";

export interface DiaryEntryDto {
  id: string;
  date: string;
  mood: Mood;
  note: string | null;
  photoUrls: string[];
  song: Song | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertDiaryEntryRequest {
  date: string;
  mood: Mood;
  note?: string;
  photos?: File[];
  songId?: string;
}

export interface SetDiaryFavoriteRequest {
  date: string;
  isFavorite: boolean;
}
