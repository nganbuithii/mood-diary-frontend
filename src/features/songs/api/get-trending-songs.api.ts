import { apiClient } from "@/lib/api/api-client";
import type { Song } from "@/features/songs/types/song.types";

export async function getTrendingSongs(): Promise<Song[]> {
  const { data } = await apiClient.get<Song[]>("/songs/trending");
  return data;
}
