"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { safeReturnPath } from "@/features/auth/utils/auth-redirect";

export function GuestOnly({ returnTo, children }: { returnTo?: string; children: ReactNode }) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) router.replace(safeReturnPath(returnTo));
  }, [currentUser, returnTo, router]);

  return <>{children}</>;
}
