import { apiClient } from "@/lib/api/api-client";
import type { Song } from "@/features/songs/types/song.types";

export async function searchSongs(query: string): Promise<Song[]> {
  const { data } = await apiClient.get<Song[]>("/songs/search", {
    params: { q: query },
  });
  return data;
}
