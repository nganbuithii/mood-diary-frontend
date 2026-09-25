import { apiClient } from "@/lib/api/api-client";

const HEALTH_CHECK_TIMEOUT_MS = 90_000;

interface HealthCheckResponse {
  status: string;
}

export async function wakeUpServer(): Promise<HealthCheckResponse> {
  const { data } = await apiClient.get<HealthCheckResponse>("/health", {
    timeout: HEALTH_CHECK_TIMEOUT_MS,
  });
  return data;
}
