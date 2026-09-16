import { apiClient } from "@/lib/api/api-client";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

export async function registerUser(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload,
  );
  return data;
}
