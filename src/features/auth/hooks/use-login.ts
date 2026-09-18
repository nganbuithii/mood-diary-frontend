import { useMutation } from "@tanstack/react-query";

import { loginUser } from "@/features/auth/api/login.api";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
