"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      router.push("/login");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-1.5"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      <LogOut className="size-4" />
      Log out
    </Button>
  );
}
