import { toast } from "sonner";

import { useLogout } from "@/features/auth/hooks/use-logout";
import { reloadToLogin } from "@/features/auth/utils/auth-redirect";
import { ApiError } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

export function useSignOut() {
  const logoutMutation = useLogout();

  const signOut = async () => {
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

  return { signOut, isSigningOut: logoutMutation.isPending };
}
