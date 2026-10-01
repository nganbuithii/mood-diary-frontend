import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "cn";

import { Envelope } from "@/components/letters/envelope";
import { OpenedLetterPreview } from "@/components/letters/opened-letter";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";
import { daysToGo, formatLongDate, journeyProgress, opensInLabel } from "@/features/letters/utils/letter-dates";

const CARD_CLASS =
  "group flex flex-col gap-3 rounded-3xl bg-surface/90 p-4 shadow-sm ring-1 ring-foreground/5 transition-all outline-none hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:hover:translate-y-0";

export function LetterCard({ letter, isNew = false }: { letter: LetterSummaryDto; isNew?: boolean }) {
  const written = formatLongDate(letter.createdAt);
  const mood = letter.moodAtWriting ? MOOD_META[letter.moodAtWriting].label : null;
  const days = daysToGo(letter.deliverAt);

  const caption =
    letter.status === "sealed"
      ? opensInLabel(letter.deliverAt)
      : letter.status === "ready"
        ? "It's here! ♡"
        : `Opened · arrived ${formatLongDate(letter.deliverAt)}`;

  return (
    <Link
      href={`/letters/${letter.id}`}
      aria-label={`Letter written ${written}. ${caption}`}
      className={cn(
        CARD_CLASS,
        letter.status === "ready" && "ring-2 ring-primary-hover/60",
        isNew && "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500",
      )}
    >
      {letter.status === "opened" ? (
        <OpenedLetterPreview mood={letter.moodAtWriting} preview={letter.preview} />
      ) : (
        <Envelope
          status={letter.status}
          mood={letter.moodAtWriting}
          className="transition-transform group-hover:-rotate-1 motion-reduce:group-hover:rotate-0"
        />
      )}

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn("font-heading text-base", letter.status === "ready" ? "text-primary-hover" : "text-foreground")}
          >
            {caption}
          </span>
          {letter.status === "ready" && (
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Open me
            </span>
          )}
          {isNew && (
            <span className="shrink-0 -rotate-3 rounded-full bg-accent-green/40 px-2 py-0.5 font-heading text-xs text-foreground">
              just sealed
            </span>
          )}
        </div>

        {letter.status === "sealed" && (
          <div aria-hidden className="flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full bg-primary-hover/70"
                style={{ width: `${Math.max(4, journeyProgress(letter.createdAt, letter.deliverAt) * 100)}%` }}
              />
            </span>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {days} {days === 1 ? "day" : "days"} to go
            </span>
          </div>
        )}

        <span className="text-xs text-muted-foreground">
          Written {written}
          {mood && ` · feeling ${mood.toLowerCase()}`}
        </span>
      </div>
    </Link>
  );
}

export function NewLetterTile() {
  return (
    <Link
      href="/letters/new"
      className={cn(
        CARD_CLASS,
        "items-center justify-center border-2 border-dashed border-primary/40 bg-surface/60 text-center shadow-none ring-0 hover:border-primary hover:bg-primary/5",
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary-hover transition-transform group-hover:rotate-90 motion-reduce:group-hover:rotate-0">
        <Plus aria-hidden className="size-6" />
      </span>
      <span className="font-heading text-lg text-foreground">Write a new letter</span>
      <span className="max-w-[16rem] text-xs text-muted-foreground">
        A few words today can mean so much to the you of tomorrow.
      </span>
    </Link>
  );
}

export function LetterCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3 rounded-3xl bg-surface/90 p-4 shadow-sm ring-1 ring-foreground/5">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
