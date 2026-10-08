import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/features/auth/api/auth.api";
import { healthKeys } from "@/features/health/constants/health-query-keys";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () =>
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== healthKeys.all[0] }),
  });
}
