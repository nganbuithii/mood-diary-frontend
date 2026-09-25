import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatar } from "@/features/profile/api/upload-avatar.api";
import type { AuthUser } from "@/features/auth/types/auth.types";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (user) => {
      queryClient.setQueryData<AuthUser>(["auth", "me"], (old) =>
        old ? { ...old, avatarUrl: user.avatarUrl } : old,
      );
    },
  });
}
