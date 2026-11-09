import { useId } from "react";
import { cn } from "cn";

const INNER_SHIELD = "M50 14 81 25v28c0 21-13 35-31 43C32 88 19 74 19 53V25Z";

interface AchievementBadgeProps {
  image: string;
  toneClass: string;
  number: number;
  isLocked?: boolean;
  className?: string;
}

export function AchievementBadge({ image, toneClass, number, isLocked = false, className }: AchievementBadgeProps) {
  const clipId = useId();

  return (
    <div aria-hidden className={cn("relative aspect-[10/11]", isLocked && "opacity-45 grayscale", className)}>
      <svg viewBox="0 0 100 110" fill="none" className="size-full overflow-visible" strokeLinejoin="round">
        <defs>
          <clipPath id={clipId}>
            <path d={INNER_SHIELD} />
          </clipPath>
        </defs>
        <path
          d="M50 4 90 18v35c0 27-17 44-40 53C27 97 10 80 10 53V18Z"
          className={cn(toneClass, "stroke-foreground/25")}
          strokeWidth="3"
        />
        <path d={INNER_SHIELD} className="fill-white" />
        <image
          href={image}
          x="17"
          y="12"
          width="66"
          height="72"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
        <path d={INNER_SHIELD} className="stroke-foreground/15" strokeWidth="1.5" />
        <text
          x="50"
          y="104"
          textAnchor="middle"
          fontSize="25"
          strokeWidth="7"
          paintOrder="stroke"
          className="fill-foreground stroke-surface font-sans font-black"
        >
          {number}
        </text>
      </svg>
    </div>
  );
}
