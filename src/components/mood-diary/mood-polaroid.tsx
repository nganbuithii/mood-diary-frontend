import { cn } from "cn";

import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";

interface MoodPolaroidProps {
  mood: Mood;
  date: string;
  note?: string;
  rotate?: "left" | "none" | "right";
  className?: string;
}

const ROTATE_CLASS: Record<NonNullable<MoodPolaroidProps["rotate"]>, string> = {
  left: "-rotate-1",
  none: "rotate-0",
  right: "rotate-1",
};

const TAPE_CLASS: Record<NonNullable<MoodPolaroidProps["rotate"]>, string> = {
  left: "-rotate-6 bg-accent-blue/60",
  none: "rotate-2 bg-secondary/50",
  right: "rotate-6 bg-accent-green/60",
};

export function MoodPolaroid({
  mood,
  date,
  note,
  rotate = "none",
  className,
}: MoodPolaroidProps) {
  const meta = MOOD_META[mood];

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-md border border-border bg-surface p-2.5 pb-3 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md",
        ROTATE_CLASS[rotate],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -top-1.5 left-1/2 h-3 w-8 -translate-x-1/2 rounded-[2px] opacity-90",
          TAPE_CLASS[rotate],
        )}
      />
      <div
        className={cn(
          "flex h-24 items-center justify-center rounded-sm text-3xl sm:h-28 sm:text-4xl",
          meta.bgClassMuted,
        )}
      >
        <span aria-hidden>{meta.emoji}</span>
      </div>
      <div className="flex flex-col gap-0.5 px-1 text-left">
        <span className="font-heading text-sm text-foreground">
          {meta.label} <span aria-hidden>♡</span>
        </span>
        <span className="text-xs text-muted-foreground">{date}</span>
        {note && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{note}</p>
        )}
      </div>
    </div>
  );
}
