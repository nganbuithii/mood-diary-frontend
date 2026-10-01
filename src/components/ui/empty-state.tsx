import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  illustration?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-[2rem] bg-surface/70 px-6 py-14 text-center ring-1 ring-foreground/5",
        className,
      )}
    >
      {illustration}
      <p className="font-heading text-2xl text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}

function ErrorState({ message, onRetry, className }: { message: string; onRetry: () => void; className?: string }) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="rounded-full" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

export { EmptyState, ErrorState };
