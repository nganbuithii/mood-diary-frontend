import { apiClient } from "@/lib/api/api-client";
import type { LoginRequest, LoginResponse } from "@/features/auth/types/auth.types";
import { ENDPOINTS } from "../constants/endpoints";

export async function loginUser(
  payload: LoginRequest,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    ENDPOINTS.LOGIN,
    payload,
  );
  return data;
}
