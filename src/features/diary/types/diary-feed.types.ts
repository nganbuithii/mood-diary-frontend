import type { Mood } from "@/features/diary/types/mood.types";
import type { DiaryEntryDto } from "@/features/diary/types/diary-entry.types";

export interface DiaryFeedFilters {
  mood?: Mood;
  month?: string;
  favorite?: boolean;
}

export interface DiaryFeedQuery extends DiaryFeedFilters {
  limit: number;
  cursor?: string;
}

export interface DiaryFeedPageDto {
  items: DiaryEntryDto[];
  nextCursor: string | null;
}
