import { apiClient } from "@/lib/api/api-client";
import type { AuthUser } from "@/features/auth/types/auth.types";

export async function uploadAvatar(file: File): Promise<Omit<AuthUser, "createdAt">> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<Omit<AuthUser, "createdAt">>("/users/me/avatar", formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}
