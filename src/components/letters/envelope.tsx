import { cn } from "cn";

import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";
import { LETTER_STATUS } from "@/features/letters/constants/letter.constants";
import type { LetterStatus } from "@/features/letters/types/letter.types";

interface EnvelopeProps {
  status: LetterStatus;
  mood: Mood | null;
  isOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Envelope({ status, mood, isOpen = false, className, children }: EnvelopeProps) {
  const tint = mood ? MOOD_META[mood].bgClassMuted : "bg-secondary/40";
  const flapOpen = isOpen || status === LETTER_STATUS.OPENED;

  return (
    <div className={cn("relative aspect-[4/3] w-full [container-type:inline-size] [perspective:900px]", className)}>
      <div className={cn("absolute inset-0 rounded-[1.25rem] shadow-sm ring-1 ring-foreground/10", tint)} />

      <div
        className={cn(
          "absolute inset-x-[9%] top-[10%] bottom-[12%] rounded-lg bg-surface p-3 shadow-sm transition-transform duration-700 ease-out motion-reduce:transition-none",
          flapOpen ? "-translate-y-[30%]" : "translate-y-0",
        )}
      >
        {children}
      </div>

      <div
        aria-hidden
        className={cn("absolute inset-x-0 bottom-0 h-[64%] rounded-b-[1.25rem]", tint)}
        style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }}
      />

      <span
        aria-hidden
        className="absolute bottom-[8%] left-1/2 z-[5] -translate-x-1/2 font-heading text-[clamp(0.7rem,5.5cqi,1rem)] leading-none whitespace-nowrap text-foreground/60"
      >
        To: future me
      </span>

      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[64%] origin-top overflow-hidden rounded-t-[1.25rem] transition-[transform,opacity] duration-500 ease-in-out motion-reduce:transition-none",
          flapOpen ? "z-0 opacity-0 [transform:rotateX(180deg)]" : "z-10 [transform:rotateX(0deg)]",
        )}
      >
        <span
          className={cn(
            "absolute top-[-7.4cqi] left-1/2 aspect-square w-[72cqi] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[16%] shadow-[0_6px_14px_-6px_color-mix(in_oklch,var(--foreground),transparent_70%)] brightness-[0.97]",
            tint,
          )}
        />
      </div>

      {!flapOpen && (
        <span
          aria-hidden
          className="absolute top-[56%] left-1/2 z-20 flex aspect-square w-[clamp(2rem,12cqi,3rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-hover font-heading text-[clamp(0.85rem,5.5cqi,1.25rem)] leading-none text-primary-foreground shadow-md"
        >
          ♥
        </span>
      )}
    </div>
  );
}
