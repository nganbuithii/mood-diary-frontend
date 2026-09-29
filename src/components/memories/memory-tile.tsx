import Link from "next/link";

import { MoodPolaroid } from "@/components/mood-diary/mood-polaroid";
import { parseDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";

const ROTATIONS = ["left", "none", "right", "none"] as const;

interface MemoryTileProps {
  entry: DiaryEntryDto;
  index: number;
}

export function MemoryTile({ entry, index }: MemoryTileProps) {
  const date = parseDateKey(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/diary?date=${entry.date}`}
      aria-label={`Open your diary for ${date}`}
      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MoodPolaroid
        mood={entry.mood}
        date={date}
        note={entry.note ?? undefined}
        photoUrl={entry.photoUrls[0]}
        hasSong={entry.song !== null}
        rotate={ROTATIONS[index % ROTATIONS.length]}
      />
    </Link>
  );
}

export function MemoryTileSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 rounded-md border border-border bg-surface p-2.5 pb-3 shadow-sm">
      <div className="h-24 animate-pulse rounded-sm bg-muted sm:h-28" />
      <div className="flex flex-col gap-1.5 px-1">
        <div className="h-3.5 w-16 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-10 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
