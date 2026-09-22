import { useMutation } from "@tanstack/react-query";

import { changePassword } from "@/features/auth/api/change-password.api";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
