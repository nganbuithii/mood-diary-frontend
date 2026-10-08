import { useQuery } from "@tanstack/react-query";

import { getTrendingSongs } from "@/features/songs/api/songs.api";
import { songKeys } from "@/features/songs/constants/song-query-keys";
import { HOUR_MS } from "@/lib/constants/time";

export function useTrendingSongs({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: songKeys.trending(),
    queryFn: getTrendingSongs,
    enabled,
    // The chart only changes daily (and the backend caches it for an hour).
    staleTime: HOUR_MS,
    retry: false,
  });
}
