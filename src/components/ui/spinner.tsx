import { cn } from "cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-3",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-primary border-t-transparent",
        SIZE_CLASSES[size],
        className,
      )}
    />
  );
}
