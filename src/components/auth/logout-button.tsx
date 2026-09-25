"use client";

import { useRouter } from "next/navigation";
import type { VariantProps } from "class-variance-authority";
import { LogOut } from "lucide-react";
import { cn } from "cn";

import { Button, type buttonVariants } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

interface LogoutButtonProps
  extends Pick<VariantProps<typeof buttonVariants>, "variant" | "size"> {
  className?: string;
  showLabel?: boolean;
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  showLabel = true,
}: LogoutButtonProps) {
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
      variant={variant}
      size={size}
      className={cn("gap-1.5", className)}
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      aria-label={showLabel ? undefined : "Log out"}
      title={showLabel ? undefined : "Log out"}
    >
      <LogOut className="size-4" />
      {showLabel && "Log out"}
    </Button>
  );
}
