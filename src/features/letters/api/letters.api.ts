import { apiClient } from "@/lib/api/api-client";
import type {
  CreateLetterRequest,
  LetterSummaryDto,
  OpenedLetterDto,
} from "@/features/letters/types/letter.types";

export async function listLetters(): Promise<LetterSummaryDto[]> {
  const { data } = await apiClient.get<LetterSummaryDto[]>("/letters");
  return data;
}

export async function createLetter(input: CreateLetterRequest): Promise<LetterSummaryDto> {
  const { data } = await apiClient.post<LetterSummaryDto>("/letters", input);
  return data;
}

export async function openLetter(id: string): Promise<OpenedLetterDto> {
  const { data } = await apiClient.post<OpenedLetterDto>(`/letters/${id}/open`);
  return data;
}

export async function deleteLetter(id: string): Promise<void> {
  await apiClient.delete(`/letters/${id}`);
}
