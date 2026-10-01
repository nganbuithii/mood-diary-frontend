import {
  mockCreateLetter,
  mockDeleteLetter,
  mockListLetters,
  mockOpenLetter,
} from "@/features/letters/api/letters.mock";
import type {
  CreateLetterRequest,
  LetterSummaryDto,
  OpenedLetterDto,
} from "@/features/letters/types/letter.types";

// TODO: swap each body for apiClient once the backend ships:
// GET /letters, POST /letters, POST /letters/:id/open, DELETE /letters/:id

export function listLetters(): Promise<LetterSummaryDto[]> {
  return mockListLetters();
}

export function createLetter(input: CreateLetterRequest): Promise<LetterSummaryDto> {
  return mockCreateLetter(input);
}

export function openLetter(id: string): Promise<OpenedLetterDto> {
  return mockOpenLetter(id);
}

export function deleteLetter(id: string): Promise<void> {
  return mockDeleteLetter(id);
}
