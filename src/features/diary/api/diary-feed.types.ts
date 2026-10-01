import type { Mood } from "@/components/mood-diary/mood.constants";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

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
