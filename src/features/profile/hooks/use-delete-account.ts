import { useMutation } from "@tanstack/react-query";

import { deleteAccount } from "@/features/profile/api/profile.api";

export function useDeleteAccount() {
  return useMutation({
    mutationFn: deleteAccount,
  });
}
