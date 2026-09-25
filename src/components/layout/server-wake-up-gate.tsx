"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useWakeUpServer } from "@/features/health/hooks/use-wake-up-server";

export function ServerWakeUpGate({ children }: { children: ReactNode }) {
  const { isSuccess, isError, isFetching, refetch } = useWakeUpServer();

  if (isSuccess) {
    return <>{children}</>;
  }

  if (isError) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="font-heading text-2xl text-foreground">
          ♡ Couldn&apos;t reach your diary
        </span>
        <p className="max-w-sm text-sm text-muted-foreground">
          The server didn&apos;t wake up in time. Please try again.
        </p>
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Retrying..." : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <Spinner size="lg" />
      <span className="font-heading text-2xl text-foreground">
        ♡ Waking up your diary...
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">
        This may take up to a minute.
      </p>
    </div>
  );
}
