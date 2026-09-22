import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/get-current-user.api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });
}
