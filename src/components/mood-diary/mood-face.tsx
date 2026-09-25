import { cn } from "cn";

import type { Mood } from "@/components/mood-diary/mood.constants";

interface MoodFaceProps {
  mood: Mood;
  className?: string;
}

export function MoodFace({ mood, className }: MoodFaceProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-full text-foreground", className)}
    >
      <Blush />
      {FEATURES[mood]}
    </svg>
  );
}

function Blush() {
  return (
    <g stroke="none" className="fill-primary-hover/35">
      <ellipse cx="11.5" cy="29" rx="4" ry="2.4" />
      <ellipse cx="36.5" cy="29" rx="4" ry="2.4" />
    </g>
  );
}

function DotEye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke="none">
      <circle cx={cx} cy={cy} r="2.6" className="fill-foreground" />
      <circle cx={cx + 0.9} cy={cy - 0.9} r="0.8" className="fill-surface" />
    </g>
  );
}

const FEATURES: Record<Mood, React.ReactNode> = {
  VERY_SAD: (
    <>
      <path d="M13.5 18.5l5 3-5 3" />
      <path d="M34.5 18.5l-5 3 5 3" />
      <path
        d="M15 26.5c-1.4 2.2-2 3.4-2 4.4a2 2 0 0 0 4 0c0-1-.6-2.2-2-4.4z"
        strokeWidth={1.4}
        className="fill-surface"
      />
      <path
        d="M33 26.5c-1.4 2.2-2 3.4-2 4.4a2 2 0 0 0 4 0c0-1-.6-2.2-2-4.4z"
        strokeWidth={1.4}
        className="fill-surface"
      />
      <path d="M18.5 36c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0" />
    </>
  ),
  SAD: (
    <>
      <path d="M12.5 18l5.5-2" strokeWidth={2} />
      <path d="M35.5 18l-5.5-2" strokeWidth={2} />
      <DotEye cx={17} cy={23} />
      <DotEye cx={31} cy={23} />
      <path d="M19.5 34.5c2.8-2.6 6.2-2.6 9 0" />
    </>
  ),
  NEUTRAL: (
    <>
      <DotEye cx={17} cy={23} />
      <DotEye cx={31} cy={23} />
      <path d="M20.5 32.5h7" />
    </>
  ),
  HAPPY: (
    <>
      <path d="M13 24c1.2-3.4 5.8-3.4 7 0" />
      <path d="M28 24c1.2-3.4 5.8-3.4 7 0" />
      <path d="M18.5 30.5c2.8 3.6 8.2 3.6 11 0" />
    </>
  ),
  VERY_HAPPY: (
    <>
      <path d="M13 23c1.2-3.4 5.8-3.4 7 0" />
      <path d="M28 23c1.2-3.4 5.8-3.4 7 0" />
      <path d="M17.5 28.5h13c0 4.6-2.9 7.5-6.5 7.5s-6.5-2.9-6.5-7.5z" className="fill-foreground" />
      <path d="M21 33.4c1.9-1.5 4.1-1.5 6 0-.9 1.2-1.9 1.8-3 1.8s-2.1-.6-3-1.8z" stroke="none" className="fill-primary" />
      <path
        d="M39 6.5c1-1.6 3.6-1.2 3.6 1 0 1.8-2.2 3.3-3.6 4.3-1.4-1-3.6-2.5-3.6-4.3 0-2.2 2.6-2.6 3.6-1z"
        stroke="none"
        className="fill-primary-hover"
      />
    </>
  ),
};
