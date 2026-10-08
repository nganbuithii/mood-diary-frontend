"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useExportAccount } from "@/features/profile/hooks/use-export-account";
import { getErrorMessage } from "@/lib/api/http-error";

export function ExportDiaryButton() {
  const exportAccount = useExportAccount();

  const handleExport = () =>
    exportAccount.mutate(undefined, {
      onSuccess: () => toast.success("Your diary is downloading ♡"),
      onError: (error) => toast.error(getErrorMessage(error, "Couldn't export your diary. Please try again.")),
    });

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 rounded-full"
      onClick={handleExport}
      disabled={exportAccount.isPending}
    >
      {exportAccount.isPending ? "Preparing..." : "Download"}
    </Button>
  );
}
