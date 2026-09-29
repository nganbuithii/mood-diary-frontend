import type { Mood } from "@/components/mood-diary/mood.constants";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

export interface DiaryFeedFilters {
  mood?: Mood;
  /** YYYY-MM */
  month?: string;
}

export interface DiaryFeedQuery extends DiaryFeedFilters {
  limit: number;
  /** Opaque cursor from the previous page's `nextCursor`. */
  cursor?: string;
}

/** Planned response of GET /diaries/feed — newest entries first. */
export interface DiaryFeedPageDto {
  items: DiaryEntryDto[];
  nextCursor: string | null;
}
