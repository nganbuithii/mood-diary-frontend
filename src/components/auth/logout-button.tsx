"use client";

import type { VariantProps } from "class-variance-authority";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Button, type buttonVariants } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { reloadToLogin } from "@/features/auth/utils/auth-redirect";
import { ApiError } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

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
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      const isSessionGone = error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED;
      if (!isSessionGone) {
        toast.error("Couldn't log out. Please check your connection and try again.");
        return;
      }
    }
    reloadToLogin();
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
