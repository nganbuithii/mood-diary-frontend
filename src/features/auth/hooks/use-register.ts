import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/features/auth/api/auth.api";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}
