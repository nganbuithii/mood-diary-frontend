import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";
import type { ChangePasswordRequest } from "@/features/auth/types/auth.types";

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, payload);
}
