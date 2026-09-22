import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "@/features/auth/api/reset-password.api";

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
