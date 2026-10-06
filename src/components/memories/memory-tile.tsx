"use client";

import Link from "next/link";

import { MoodPolaroid } from "@/components/mood-diary/mood-polaroid";
import { parseDateKey } from "@/lib/date";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { FavoriteHeartButton } from "@/components/favorites/favorite-heart-button";

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
    // The heart sits next to the link rather than inside it: a button can't live inside an <a>.
    <div className="group relative">
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
      <FavoriteHeartButton
        date={entry.date}
        label={date}
        isFavorite={entry.isFavorite}
        // Follows the polaroid's hover lift so the heart stays pinned to the photo corner.
        className="absolute top-4 right-4 group-hover:-translate-y-1"
      />
    </div>
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
