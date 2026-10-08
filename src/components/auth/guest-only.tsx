"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { safeReturnPath } from "@/features/auth/utils/auth-redirect";

export function GuestOnly({ returnTo, children }: { returnTo?: string; children: ReactNode }) {
  const router = useRouter();
  const { data: currentUser, error } = useCurrentUser();
  const isSignedIn = Boolean(currentUser) && !error;

  useEffect(() => {
    if (isSignedIn) router.replace(safeReturnPath(returnTo));
  }, [isSignedIn, returnTo, router]);

  return <>{children}</>;
}
