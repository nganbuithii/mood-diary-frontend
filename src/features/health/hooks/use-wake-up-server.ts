import { useQuery } from "@tanstack/react-query";

import { wakeUpServer } from "@/features/health/api/wake-up-server.api";
import { SECOND_MS } from "@/lib/constants/time";

export const WAKE_UP_QUERY_KEY = ["health", "wake-up"] as const;

export function useWakeUpServer() {
  return useQuery({
    queryKey: WAKE_UP_QUERY_KEY,
    queryFn: wakeUpServer,
    retry: 1,
    retryDelay: 2 * SECOND_MS,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
