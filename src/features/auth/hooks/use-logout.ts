import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/api/auth.api";

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
  });
}
