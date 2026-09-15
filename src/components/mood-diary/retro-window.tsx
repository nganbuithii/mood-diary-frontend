import type { ReactNode } from "react";
import { Square, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "cn";

interface RetroWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Decorative "retro desktop window" chrome around a shadcn Card.
 * The title bar controls are presentational only — no close/minimize/
 * maximize behavior is implemented.
 */
export function RetroWindow({ title, children, className }: RetroWindowProps) {
  return (
    <Card className={cn("gap-0 rounded-lg p-0", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-accent-blue/20 px-3 py-2">
        <span className="flex items-center gap-1.5 font-heading text-base text-foreground">
          <span aria-hidden>♡</span>
          {title}
        </span>
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="flex size-4 items-center justify-center rounded-[3px] border border-border bg-surface text-muted-foreground">
            <Square className="size-2.5" />
          </span>
          <span className="flex size-4 items-center justify-center rounded-[3px] border border-border bg-surface text-muted-foreground">
            <X className="size-2.5" />
          </span>
        </span>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}
