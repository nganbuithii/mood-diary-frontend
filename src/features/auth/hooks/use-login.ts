import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/features/auth/api/login.api";
import { WAKE_UP_QUERY_KEY } from "@/features/health/hooks/use-wake-up-server";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: () =>
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== WAKE_UP_QUERY_KEY[0] }),
  });
}
