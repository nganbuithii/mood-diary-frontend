import { useQuery } from "@tanstack/react-query";

import { wakeUpServer } from "@/features/health/api/wake-up-server.api";
import { SECOND_MS } from "@/lib/constants/time";

export function useWakeUpServer() {
  return useQuery({
    queryKey: ["health", "wake-up"],
    queryFn: wakeUpServer,
    retry: 1,
    retryDelay: 2 * SECOND_MS,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
