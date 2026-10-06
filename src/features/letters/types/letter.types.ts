import type { Mood } from "@/features/diary/types/mood.types";
import type { LETTER_STATUS } from "@/features/letters/constants/letter.constants";

export type LetterStatus = (typeof LETTER_STATUS)[keyof typeof LETTER_STATUS];

export interface LetterSummaryDto {
  id: string;
  deliverAt: string;
  createdAt: string;
  status: LetterStatus;
  moodAtWriting: Mood | null;
  preview: string | null;
}

export interface OpenedLetterDto {
  id: string;
  body: string;
  moodAtWriting: Mood | null;
  deliverAt: string;
  createdAt: string;
  openedAt: string;
}

export interface CreateLetterRequest {
  body: string;
  deliverAt: string;
  moodAtWriting?: Mood;
}

export const MAX_LETTER_LENGTH = 5000;
