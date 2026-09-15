import type { ReactNode } from "react";
import { cn } from "cn";

export function AuthBrandingPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative hidden flex-col justify-center overflow-hidden px-12 py-16 lg:flex",
        className
      )}
    >
      {children}
    </div>
  );
}
