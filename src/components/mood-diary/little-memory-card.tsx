import { Music2 } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import { formatRelativeDay, parseDateKey } from "@/components/calendar/calendar.utils";
import type { LittleMemoryDto } from "@/features/diary/api/little-memory.types";

interface LittleMemoryCardProps {
  memory: LittleMemoryDto;
  today?: Date;
}

export function LittleMemoryCard({ memory, today = new Date() }: LittleMemoryCardProps) {
  const meta = MOOD_META[memory.mood];
  const date = parseDateKey(memory.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="relative mx-auto flex w-full max-w-sm rotate-1 flex-col gap-3 rounded-md border border-border bg-surface p-3 pb-4 shadow-sm transition-transform hover:rotate-0 lg:max-w-none">
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-3 rounded-[2px] bg-secondary/50"
      />

      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <h2 className="font-heading text-lg text-foreground">
          <span aria-hidden>💌</span> A little memory
        </h2>
        <span className="shrink-0 rounded-full bg-accent-blue/25 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
          {formatRelativeDay(date, today)}
        </span>
      </div>

      <div
        className={cn(
          "flex aspect-4/3 items-center justify-center overflow-hidden rounded-sm",
          !memory.photoUrl && meta.bgClassMuted,
        )}
      >
        {memory.photoUrl ? (
          <img
            src={memory.photoUrl}
            alt={`Photo from ${formattedDate}`}
            className="size-full object-cover"
          />
        ) : (
          <span className={cn("size-20 rounded-full p-1 shadow-sm", meta.bgClass)}>
            <MoodFace mood={meta.value} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 font-heading text-base text-foreground">
            {memory.photoUrl && (
              <span className={cn("size-5 shrink-0 rounded-full", meta.bgClass)}>
                <MoodFace mood={meta.value} />
              </span>
            )}
            <span className="truncate">{meta.label}</span>
          </span>
          <time dateTime={memory.date} className="shrink-0 text-xs text-muted-foreground">
            {formattedDate}
          </time>
        </div>

        <p className="line-clamp-2 text-sm text-foreground/80">{memory.content}</p>

        {memory.song && (
          <div className="mt-1 flex min-w-0 items-center gap-2 rounded-full bg-muted/60 py-1 pr-3 pl-1">
            <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-blue/30 text-foreground">
              {memory.song.artworkUrl ? (
                <img src={memory.song.artworkUrl} alt="" className="size-full object-cover" />
              ) : (
                <Music2 className="size-3" />
              )}
            </span>
            <span className="min-w-0 truncate text-xs">
              <span className="font-medium text-foreground">{memory.song.title}</span>
              <span className="text-muted-foreground"> · {memory.song.artist}</span>
            </span>
          </div>
        )}
      </div>

      <Button type="button" variant="outline" size="sm" className="mx-1 rounded-full">
        View memory <span aria-hidden>♡</span>
      </Button>
    </article>
  );
}
