import { cn } from "cn";

import { MONTH_THEME } from "@/components/achievements/achievement.constants";
import type { MonthlyBadgeDto } from "@/features/achievements/types/achievement.types";
import { formatDate, tryParseMonthKey } from "@/lib/date";

const RING_RADIUS = 47;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export function MonthBadge({ badge }: { badge: MonthlyBadgeDto }) {
  const date = tryParseMonthKey(badge.month);
  if (!date) return null;

  const theme = MONTH_THEME[date.getMonth()];
  const progress = Math.min(badge.pages / badge.goal, 1);
  const status = badge.earned ? "earned" : `${badge.pages} of ${badge.goal} pages`;

  return (
    <li className="flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28">
      <div className="@container relative aspect-square w-full">
        <svg viewBox="0 0 100 100" fill="none" aria-hidden className="size-full overflow-visible">
          <g className={cn(!badge.earned && "opacity-45 grayscale")}>
            <circle cx="50" cy="50" r="42" className={cn(theme.toneClass, "stroke-foreground/25")} strokeWidth="3" />
            <circle cx="50" cy="50" r="32" className="fill-surface/40" />
          </g>
          {!badge.earned && (
            <>
              <circle cx="50" cy="50" r={RING_RADIUS} className="stroke-border/50" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                className="stroke-primary-hover"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${RING_LENGTH * progress} ${RING_LENGTH}`}
                transform="rotate(-90 50 50)"
              />
            </>
          )}
        </svg>
        <span
          aria-hidden
          className={cn("absolute top-1/2 left-1/2 -translate-1/2 text-[40cqw] leading-none", !badge.earned && "opacity-45 grayscale")}
        >
          {theme.emoji}
        </span>
      </div>
      <span className="flex flex-col">
        <span className="text-sm font-bold text-foreground">
          {formatDate(date, "month")}
          <span className="sr-only">
            {" "}
            {date.getFullYear()}: {status}
          </span>
        </span>
        <span aria-hidden className="text-xs text-muted-foreground">
          {badge.earned ? date.getFullYear() : `${badge.pages}/${badge.goal} pages`}
        </span>
      </span>
    </li>
  );
}
