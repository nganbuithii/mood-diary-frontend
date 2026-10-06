"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api/http-error";
import { isClientErrorStatus } from "@/lib/api/http-status";
import { SECOND_MS } from "@/lib/constants/time";

const MAX_QUERY_RETRIES = 3;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * SECOND_MS,
        retry: (failureCount, error) =>
          !(error instanceof ApiError && isClientErrorStatus(error.status)) &&
          failureCount < MAX_QUERY_RETRIES,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
