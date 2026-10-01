import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ConfirmBarProps {
  message: React.ReactNode;
  icon?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  tone?: "default" | "destructive";
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}
function ConfirmBar({
  message,
  icon,
  confirmLabel,
  cancelLabel = "Cancel",
  pendingLabel,
  tone = "default",
  isPending = false,
  onConfirm,
  onCancel,
  className,
}: ConfirmBarProps) {
  return (
    <div
      role="alert"
      data-slot="confirm-bar"
      className={cn(
        "flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:justify-between",
        tone === "destructive" ? "border-destructive/30 bg-destructive/5" : "border-primary/40 bg-primary/10",
        className,
      )}
    >
      <div className="flex items-start gap-2 text-sm text-foreground">
        {icon}
        <div>{message}</div>
      </div>
      <div className="flex shrink-0 gap-2 self-end sm:self-auto">
        <Button type="button" variant="outline" className="rounded-full" disabled={isPending} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === "destructive" ? "destructive" : "default"}
          className="min-w-24 rounded-full"
          disabled={isPending}
          onClick={onConfirm}
        >
          {isPending ? (
            <>
              <Spinner size="sm" /> {pendingLabel}
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </div>
    </div>
  );
}

export { ConfirmBar };
