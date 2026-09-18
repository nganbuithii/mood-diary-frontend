import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/api/logout.api";

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
  });
}
