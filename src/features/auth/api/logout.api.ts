import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";

export async function logoutUser(): Promise<void> {
  await apiClient.post(ENDPOINTS.LOGOUT);
}
