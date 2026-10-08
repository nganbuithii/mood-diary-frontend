import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/features/auth/api/auth.api";
import { authKeys } from "@/features/auth/constants/auth-query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getCurrentUser,
    retry: false,
  });
}
