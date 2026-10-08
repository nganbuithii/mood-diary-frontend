"use client";

import { Download } from "lucide-react";
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
      variant="link"
      size="sm"
      className="h-auto self-start px-0"
      onClick={handleExport}
      disabled={exportAccount.isPending}
    >
      <Download aria-hidden />
      {exportAccount.isPending ? "Preparing your copy..." : "Download a copy of my diary"}
    </Button>
  );
}
