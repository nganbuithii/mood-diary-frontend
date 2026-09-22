import { apiClient } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/features/auth/constants/endpoints";
import type { AuthUser } from "@/features/auth/types/auth.types";

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>(ENDPOINTS.ME);
  return data;
}
