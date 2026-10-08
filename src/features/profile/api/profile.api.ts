import { apiClient } from "@/lib/api/api-client";
import type { AuthUser } from "@/features/auth/types/auth.types";
import type { AccountExport } from "@/features/profile/types/account-export.types";
import type { ReminderSettings } from "@/features/profile/types/reminder.types";

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

export async function getReminderSettings(): Promise<ReminderSettings> {
  const { data } = await apiClient.get<ReminderSettings>("/users/me/reminder");
  return data;
}

export async function updateReminderSettings(settings: ReminderSettings): Promise<ReminderSettings> {
  const { data } = await apiClient.put<ReminderSettings>("/users/me/reminder", settings);
  return data;
}
