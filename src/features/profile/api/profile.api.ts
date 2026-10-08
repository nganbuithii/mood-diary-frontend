import { apiClient } from "@/lib/api/api-client";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { AccountExport } from "@/features/profile/types/account-export.types";

export async function uploadAvatar(file: File): Promise<Omit<AuthUser, "createdAt">> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<Omit<AuthUser, "createdAt">>("/users/me/avatar", formData, {
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function exportAccount(): Promise<AccountExport> {
  const { data } = await apiClient.get<AccountExport>("/users/me/export");
  return data;
}

export async function deleteAccount(password: string): Promise<void> {
  await apiClient.delete("/users/me", { data: { password } });
}
