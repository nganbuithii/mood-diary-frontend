import Link from "next/link";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { MoodAvatar } from "@/components/mood-diary/mood-avatar";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import { formatDate, formatDateKey, parseDateKey } from "@/lib/date";
import type { LittleMemoryDto } from "@/features/diary/types/little-memory.types";
import { useDailyMemory } from "@/features/diary/hooks/use-daily-memory";
import { useToday } from "@/lib/hooks/use-today";

export function LittleMemoryCard() {
  const today = useToday();
  const { data: memory } = useDailyMemory(formatDateKey(today));

  if (!memory) return null;

  return <LittleMemoryContent memory={memory} />;
}

interface LittleMemoryContentProps {
  memory: LittleMemoryDto;
}

function LittleMemoryContent({ memory }: LittleMemoryContentProps) {
  const meta = MOOD_META[memory.mood];
  const date = parseDateKey(memory.entryDate);
  const formattedDate = formatDate(date, "shortDate");

  return (
    <article className="relative mx-auto flex w-full max-w-sm rotate-1 flex-col gap-3 rounded-md border border-border bg-surface p-3 pb-4 shadow-sm transition-transform hover:rotate-0 lg:max-w-none">
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-3 rounded-xs bg-secondary/50"
      />

      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <h2 className="font-heading text-lg text-foreground">
          <span aria-hidden>💌</span> A little memory
        </h2>
        <span className="shrink-0 rounded-full bg-accent-blue/25 px-2 py-0.5 text-[0.7rem] text-muted-foreground">
          {memory.relativeLabel}
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
          <MoodAvatar mood={meta.value} className="size-20 p-1 shadow-sm" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 font-heading text-base text-foreground">
            {memory.photoUrl && (
              <MoodAvatar mood={meta.value} className="size-5" />
            )}
            <span className="truncate">{meta.label}</span>
          </span>
          <time dateTime={memory.entryDate} className="shrink-0 text-xs text-muted-foreground">
            {formattedDate}
          </time>
        </div>

        {memory.content && (
          <p className="line-clamp-2 text-sm text-foreground/80">{memory.content}</p>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mx-1 rounded-full"
        render={
          <Link href={`/diary?date=${memory.entryDate}`}>
            View memory <span aria-hidden>♡</span>
          </Link>
        }
      />
    </article>
  );
}
