import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";
import type { ResetPasswordRequest } from "@/features/auth/types/auth.types";

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<void> {
  await apiClient.post(ENDPOINTS.RESET_PASSWORD, payload);
}
