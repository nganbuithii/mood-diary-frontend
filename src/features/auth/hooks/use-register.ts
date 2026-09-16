import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/features/auth/api/register.api";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}
