import { Music2 } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="relative overflow-visible rounded-lg px-5 sm:px-6">
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-2 rounded-[2px] bg-secondary/50"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-xl text-foreground">
          <span aria-hidden>💌</span> A little memory
        </h2>
        <span className="rounded-full bg-accent-blue/25 px-2.5 py-0.5 text-xs text-muted-foreground">
          {formatRelativeDay(date, today)}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-3 rounded-md p-3",
            meta.bgClassMuted,
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className={cn("size-10 shrink-0 rounded-full p-0.5 shadow-sm", meta.bgClass)}>
              <MoodFace mood={meta.value} />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-heading text-base text-foreground">{meta.label}</span>
              <time dateTime={memory.date} className="text-xs text-muted-foreground">
                {formattedDate}
              </time>
            </div>
          </div>

          <p className="line-clamp-3 text-sm text-foreground/80">{memory.content}</p>

          {memory.song && (
            <div className="flex min-w-0 items-center gap-2 rounded-full bg-surface/80 py-1 pr-3 pl-1 shadow-sm">
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-blue/30 text-foreground">
                {memory.song.artworkUrl ? (
                  <img src={memory.song.artworkUrl} alt="" className="size-full object-cover" />
                ) : (
                  <Music2 className="size-3.5" />
                )}
              </span>
              <span className="min-w-0 truncate text-xs">
                <span className="font-medium text-foreground">{memory.song.title}</span>
                <span className="text-muted-foreground"> · {memory.song.artist}</span>
              </span>
            </div>
          )}
        </div>

        {memory.photoUrl && (
          <div className="shrink-0 self-center rotate-1 rounded-md border border-border bg-surface p-1.5 pb-4 shadow-sm sm:self-start">
            <img
              src={memory.photoUrl}
              alt={`Photo from ${formattedDate}`}
              className="size-32 rounded-sm object-cover sm:size-28"
            />
          </div>
        )}
      </div>

      <Button type="button" variant="outline" className="self-center rounded-full px-5 sm:self-end">
        View memory <span aria-hidden>♡</span>
      </Button>
    </Card>
  );
}
