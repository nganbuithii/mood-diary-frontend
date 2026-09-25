import { useQuery } from "@tanstack/react-query";

import { wakeUpServer } from "@/features/health/api/wake-up-server.api";

export function useWakeUpServer() {
  return useQuery({
    queryKey: ["health", "wake-up"],
    queryFn: wakeUpServer,
    retry: 1,
    retryDelay: 2_000,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
