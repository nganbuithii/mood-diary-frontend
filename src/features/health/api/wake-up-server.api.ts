import { apiClient } from "@/lib/api/api-client";
import { SECOND_MS } from "@/lib/constants/time";

const HEALTH_CHECK_TIMEOUT_MS = 90 * SECOND_MS;

interface HealthCheckResponse {
  status: string;
}

export async function wakeUpServer(): Promise<HealthCheckResponse> {
  const { data } = await apiClient.get<HealthCheckResponse>("/health", {
    timeout: HEALTH_CHECK_TIMEOUT_MS,
  });
  return data;
}
