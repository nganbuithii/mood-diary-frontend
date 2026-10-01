import type { Mood } from "@/components/mood-diary/mood.constants";

export type LetterStatus = "sealed" | "ready" | "opened";

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
export const MAX_SEALED_LETTERS = 50;
