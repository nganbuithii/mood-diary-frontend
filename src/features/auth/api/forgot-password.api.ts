import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";
import type { ForgotPasswordRequest } from "@/features/auth/types/auth.types";

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<void> {
  await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, payload);
}
