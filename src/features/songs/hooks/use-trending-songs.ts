import { useQuery } from "@tanstack/react-query";

import { getTrendingSongs } from "@/features/songs/api/get-trending-songs.api";

export function useTrendingSongs({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ["songs", "trending"],
    queryFn: getTrendingSongs,
    enabled,
    // The chart only changes daily (and the backend caches it for an hour).
    staleTime: 60 * 60_000,
    retry: false,
  });
}
