import { cn } from "cn";

import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";

const RULED_PAPER =
  "[background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(var(--line)-1px),color-mix(in_oklch,var(--border),transparent_45%)_calc(var(--line)-1px),color-mix(in_oklch,var(--border),transparent_45%)_var(--line))]";

export function MoodStamp({ mood, className }: { mood: Mood | null; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex aspect-[4/5] items-center justify-center rounded-[3px] border-[3px] border-dotted border-surface bg-surface/70 p-0.5 shadow-sm",
        className,
      )}
    >
      <span className={cn("size-full rounded-[2px] p-[10%]", mood ? MOOD_META[mood].bgClass : "bg-primary/40")}>
        {mood ? (
          <MoodFace mood={mood} />
        ) : (
          <span className="flex size-full items-center justify-center font-heading text-primary-hover">✿</span>
        )}
      </span>
    </span>
  );
}

/** A read letter tucked back into its envelope, for the letterbox grid. */
export function OpenedLetterPreview({ mood, preview }: { mood: Mood | null; preview: string | null }) {
  const tint = mood ? MOOD_META[mood].bgClassMuted : "bg-secondary/40";

  return (
    <div aria-hidden className="relative aspect-[4/3] w-full">
      <div className={cn("absolute inset-x-0 bottom-0 h-[55%] rounded-2xl ring-1 ring-foreground/10", tint)} />

      <div
        className={cn(
          "absolute inset-x-[9%] top-[3%] bottom-[18%] -rotate-2 overflow-hidden rounded-md bg-surface px-4 pt-3 shadow-md ring-1 ring-foreground/5 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-3 motion-reduce:transition-none",
        )}
      >
        <div className={cn("[--line:1.25rem]", RULED_PAPER)}>
          <p className="font-heading text-sm leading-[var(--line)] text-foreground/80">Dear me,</p>
          <p className="line-clamp-3 font-heading text-xs leading-[var(--line)] whitespace-pre-line text-foreground/65">
            {preview?.replace(/^dear (future )?me,?\s*/i, "") ?? "…"}
          </p>
        </div>
      </div>

      <div
        className={cn("absolute inset-x-0 bottom-0 h-[42%] rounded-2xl shadow-sm", tint)}
        style={{ clipPath: "polygon(0 0, 50% 38%, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="absolute right-[6%] bottom-[8%] w-[13%] rotate-6">
        <MoodStamp mood={mood} />
      </div>
      <span className="absolute bottom-[9%] left-[6%] font-heading text-xs text-foreground/60">opened ✓</span>
    </div>
  );
}

interface LetterPaperProps {
  body: string;
  mood: Mood | null;
  writtenOn: string;
  writtenAgo: string;
}

/** The full letter, as it reads once opened. */
export function LetterPaper({ body, mood, writtenOn, writtenAgo }: LetterPaperProps) {
  const text = body.replace(/^dear (future )?me,?\s*/i, "");

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 rotate-1 rounded-md bg-surface/60 shadow-sm ring-1 ring-foreground/5" />

      <div
        className={cn(
          "relative -rotate-[0.6deg] rounded-md bg-surface px-6 pt-10 pb-8 shadow-lg ring-1 ring-foreground/5 sm:px-12 sm:pt-12",
        )}
      >
        <span aria-hidden className="absolute -top-2.5 left-8 h-5 w-20 -rotate-6 rounded-[2px] bg-accent-green/60" />
        <span aria-hidden className="absolute -top-2.5 right-10 h-5 w-16 rotate-3 rounded-[2px] bg-mood-happy/70" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-heading text-sm text-muted-foreground">{writtenOn}</span>
            <span className="text-xs text-muted-foreground/80">{writtenAgo}</span>
          </div>
          <MoodStamp mood={mood} className="w-12 shrink-0 rotate-6 sm:w-14" />
        </div>

        <div className={cn("mt-4 [--line:2rem]", RULED_PAPER)}>
          <p className="font-heading text-2xl leading-[var(--line)] text-foreground">Dear me,</p>
          <p className="font-heading text-lg leading-[var(--line)] whitespace-pre-wrap text-foreground">{text}</p>
          <p className="mt-[var(--line)] text-right font-heading text-xl leading-[var(--line)] text-primary-hover">
            With love, past you ♡
          </p>
          {mood && (
            <p className="text-right text-xs leading-[var(--line)] text-muted-foreground">
              (feeling {MOOD_META[mood].label.toLowerCase()} that day)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
