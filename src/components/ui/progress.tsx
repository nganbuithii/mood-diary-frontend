import { cn } from "cn";

interface ProgressProps {
  value: number;
  label: string;
  className?: string;
}

function Progress({ value, label, className }: ProgressProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      data-slot="progress"
      className={cn("h-1.5 overflow-hidden rounded-full bg-muted", className)}
    >
      <div className="h-full rounded-full bg-primary-hover/70" style={{ width: `${Math.max(4, percent)}%` }} />
    </div>
  );
}

export { Progress };
