import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps extends Omit<ComponentProps<typeof Button>, "type"> {
  isPending: boolean;
  pendingLabel: ReactNode;
}

export function SubmitButton({ isPending, pendingLabel, disabled, className, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" className={cn("w-full", className)} disabled={isPending || disabled} {...props}>
      {isPending ? pendingLabel : children}
    </Button>
  );
}
