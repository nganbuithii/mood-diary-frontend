import { useQuery } from "@tanstack/react-query";

import { wakeUpServer } from "@/features/health/api/health.api";
import { healthKeys } from "@/features/health/constants/health-query-keys";
import { SECOND_MS } from "@/lib/constants/time";

export function useWakeUpServer() {
  return useQuery({
    queryKey: healthKeys.wakeUp(),
    queryFn: wakeUpServer,
    retry: 1,
    retryDelay: 2 * SECOND_MS,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
