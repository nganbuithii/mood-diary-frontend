import { apiClient } from "@/lib/api/api-client";

export async function deleteDiaryEntry(date: string): Promise<void> {
  await apiClient.delete(`/diaries/${date}`);
}
