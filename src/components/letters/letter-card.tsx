import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Envelope } from "@/components/letters/envelope";
import { OpenedLetterPreview } from "@/components/letters/opened-letter";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";
import { daysToGo, formatLongDate, journeyProgress, opensInLabel } from "@/features/letters/utils/letter-dates";

const LINK_CLASS = "group block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60";
const CARD_CLASS =
  "h-full gap-3 rounded-3xl border-transparent bg-surface/90 p-4 ring-1 ring-foreground/5 transition-all group-hover:-translate-y-1 group-hover:shadow-md motion-reduce:group-hover:translate-y-0";

function captionFor(letter: LetterSummaryDto) {
  if (letter.status === "sealed") return opensInLabel(letter.deliverAt);
  if (letter.status === "ready") return "It's here! ♡";
  return `Opened · arrived ${formatLongDate(letter.deliverAt)}`;
}

export function LetterCard({ letter, isNew = false }: { letter: LetterSummaryDto; isNew?: boolean }) {
  const written = formatLongDate(letter.createdAt);
  const mood = letter.moodAtWriting ? MOOD_META[letter.moodAtWriting].label : null;
  const caption = captionFor(letter);
  const days = daysToGo(letter.deliverAt);

  return (
    <Link
      href={`/letters/${letter.id}`}
      aria-label={`Letter written ${written}. ${caption}`}
      className={cn(LINK_CLASS, isNew && "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500")}
    >
      <Card className={cn(CARD_CLASS, letter.status === "ready" && "ring-2 ring-primary-hover/60")}>
        {letter.status === "opened" ? (
          <OpenedLetterPreview mood={letter.moodAtWriting} preview={letter.preview} />
        ) : (
          <Envelope
            status={letter.status}
            mood={letter.moodAtWriting}
            className="transition-transform group-hover:-rotate-1 motion-reduce:group-hover:rotate-0"
          />
        )}

        <CardContent className="flex flex-col gap-1.5 px-1">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("font-heading text-base", letter.status === "ready" ? "text-primary-hover" : "text-foreground")}>
              {caption}
            </span>
            {letter.status === "ready" && <Badge>Open me</Badge>}
            {isNew && (
              <Badge variant="soft" className="-rotate-3">
                just sealed
              </Badge>
            )}
          </div>

          {letter.status === "sealed" && (
            <div className="flex items-center gap-2">
              <Progress
                value={journeyProgress(letter.createdAt, letter.deliverAt)}
                label="How far along its journey the letter is"
                className="flex-1"
              />
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {days} {days === 1 ? "day" : "days"} to go
              </span>
            </div>
          )}

          <span className="text-xs text-muted-foreground">
            Written {written}
            {mood && ` · feeling ${mood.toLowerCase()}`}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function NewLetterTile() {
  return (
    <Link href="/letters/new" className={LINK_CLASS}>
      <Card
        className={cn(
          CARD_CLASS,
          "items-center justify-center border-2 border-dashed border-primary/40 bg-surface/60 text-center shadow-none ring-0 group-hover:border-primary group-hover:bg-primary/5",
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary-hover transition-transform group-hover:rotate-90 motion-reduce:group-hover:rotate-0">
          <Plus aria-hidden className="size-6" />
        </span>
        <span className="font-heading text-lg text-foreground">Write a new letter</span>
        <span className="max-w-[16rem] text-xs text-muted-foreground">
          A few words today can mean so much to the you of tomorrow.
        </span>
      </Card>
    </Link>
  );
}

export function LetterCardSkeleton() {
  return (
    <Card aria-hidden className={cn(CARD_CLASS, "group-hover:translate-y-0")}>
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
    </Card>
  );
}
