import { apiClient } from "@/lib/api/api-client";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<UserProfile>(
    "/users/me/avatar",
    formData,
    { headers: { "Content-Type": undefined } },
  );
  return data;
}
