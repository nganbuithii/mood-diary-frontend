"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { currentLocationPath, loginPathFor } from "@/features/auth/utils/auth-redirect";
import { ApiError } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: currentUser, error, isFetching, refetch } = useCurrentUser();
  const isSignedOut = error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED;
  const shouldRedirect = isSignedOut && !isFetching;

  useEffect(() => {
    if (shouldRedirect) router.replace(loginPathFor(currentLocationPath()));
  }, [shouldRedirect, router]);

  if (currentUser && !isSignedOut) return <>{children}</>;

  if (error && !isSignedOut) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="font-heading text-2xl text-foreground">♡ Couldn&apos;t open your diary</span>
        <p className="max-w-sm text-sm text-muted-foreground">Something went wrong. Please try again.</p>
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Retrying..." : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
