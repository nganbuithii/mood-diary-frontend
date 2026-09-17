import { useMutation } from "@tanstack/react-query";

import { loginUser } from "@/features/auth/api/login.api";
import { setAuthTokens } from "@/lib/auth/token-storage";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuthTokens(data.accessToken, data.refreshToken);
    },
  });
}
