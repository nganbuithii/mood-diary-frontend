import { Heart } from "lucide-react";
import { cn } from "cn";

import { journeyProgress } from "@/features/letters/utils/letter-dates";

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface JourneyTrackProps {
  createdAt: string;
  deliverAt: string;
  now?: Date;
  size?: "sm" | "md";
  className?: string;
}

export function JourneyTrack({ createdAt, deliverAt, now, size = "sm", className }: JourneyTrackProps) {
  const percent = Math.round(journeyProgress(createdAt, deliverAt, now) * 100);
  const isMd = size === "md";

  return (
    <div className={cn("flex flex-col", isMd ? "gap-2" : "gap-1.5", className)}>
      <div
        role="progressbar"
        aria-label="How far along its journey the letter is"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className={cn("flex items-center", isMd ? "h-8 px-4" : "h-6 px-3")}
      >
        <div className={cn("relative w-full rounded-full bg-muted", isMd ? "h-2.5" : "h-2")}>
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/70 to-primary-hover transition-[width] duration-700"
            style={{ width: `${percent}%` }}
          />
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-hover/60 bg-surface",
              isMd ? "size-3.5" : "size-3",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-primary-hover shadow-sm ring-2 ring-primary-hover transition-[left] duration-700",
              isMd ? "size-8" : "size-6",
            )}
            style={{ left: `${percent}%` }}
          >
            <Heart className={cn("fill-current", isMd ? "size-4" : "size-3")} />
          </span>
        </div>
      </div>

      <div className={cn("flex items-end justify-between gap-2 tabular-nums", isMd ? "text-xs" : "text-[11px]")}>
        <span className="flex flex-col leading-tight">
          <span className="text-muted-foreground">Written</span>
          <span className="font-medium text-foreground">{formatShortDate(createdAt)}</span>
        </span>
        {isMd && <span className="pb-px text-muted-foreground">{percent}% of the way</span>}
        <span className="flex flex-col text-right leading-tight">
          <span className="text-muted-foreground">Opens</span>
          <span className="font-medium text-foreground">{formatShortDate(deliverAt)}</span>
        </span>
      </div>
    </div>
  );
}
