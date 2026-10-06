"use client";

import Link from "next/link";
import { Music2, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { FavoriteHeartButton } from "@/components/favorites/favorite-heart-button";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import { parseDateKey } from "@/lib/date";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { useSongPreview } from "@/features/songs/hooks/use-song-preview";
import type { Song } from "@/features/songs/types/song.types";

interface FavoriteCardProps {
  entry: DiaryEntryDto;
  featured?: boolean;
}

export const FAVORITES_GRID_CLASS =
  "grid grid-flow-dense auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[9.5rem] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

export function FavoriteCard({ entry, featured = false }: FavoriteCardProps) {
  const meta = MOOD_META[entry.mood];
  const photoUrl = entry.photoUrls[0];
  const day = parseDateKey(entry.date);
  const shortDate = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const longDate = day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const variant = featured ? "featured" : photoUrl ? "photo" : "sticker";

  return (
    <div
      className={cn(
        "group relative transition-[opacity,filter] duration-300",
        variant === "featured" && "col-span-2 row-span-2",
        variant === "photo" && "row-span-2",
        !entry.isFavorite && "opacity-45 grayscale",
      )}
    >
      <Link
        href={`/diary?date=${entry.date}`}
        aria-label={`Open your diary for ${longDate}`}
        className={cn(
          "relative flex size-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-foreground/5 transition-all duration-300 outline-none",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          !photoUrl && meta.bgClassMuted,
        )}
      >
        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />

            <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
            <Caption entry={entry} date={featured ? longDate : shortDate} featured={featured} onPhoto />
          </>
        ) : (
          <>
            <Doodles />
            <Caption entry={entry} date={featured ? longDate : shortDate} featured={featured} />
          </>
        )}

        {featured && (
          <span className="absolute top-3 left-3 rotate-[-4deg] rounded-full bg-surface/90 px-3 py-1 font-heading text-sm text-foreground shadow-sm">
            ✦ latest treasure
          </span>
        )}
      </Link>

      <FavoriteHeartButton
        date={entry.date}
        label={shortDate}
        isFavorite={entry.isFavorite}
        className="absolute top-3 right-3 group-hover:-translate-y-1"
      />

      {featured && entry.song?.previewUrl && (
        <SongPreviewButton song={entry.song} className="absolute top-3 right-13 group-hover:-translate-y-1" />
      )}
    </div>
  );
}

function SongPreviewButton({ song, className }: { song: Song; className?: string }) {
  const { isPlaying, toggle } = useSongPreview(song.previewUrl);

  return (
    <button
      type="button"
      aria-pressed={isPlaying}
      aria-label={isPlaying ? `Pause preview of ${song.title}` : `Play a preview of ${song.title}`}
      onClick={() => toggle().catch(() => toast.error("Couldn't play this preview."))}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur-sm transition-all outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
        isPlaying && "text-primary-hover",
        className,
      )}
    >
      {isPlaying ? (
        <Pause aria-hidden className="size-3.5 fill-current" />
      ) : (
        <Play aria-hidden className="size-3.5 translate-x-px fill-current" />
      )}
    </button>
  );
}

function Caption({
  entry,
  date,
  featured,
  onPhoto = false,
}: {
  entry: DiaryEntryDto;
  date: string;
  featured: boolean;
  onPhoto?: boolean;
}) {
  const meta = MOOD_META[entry.mood];

  return (
    <div
      className={cn(
        "relative mt-auto flex w-full flex-col gap-1 p-3 text-left sm:p-4",
        onPhoto ? "text-white" : "text-foreground",
        featured && "gap-2 sm:p-6",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "shrink-0 rounded-full p-0.5 shadow-sm ring-2 ring-surface/80",
            meta.bgClass,
            featured ? "size-10 sm:size-12" : onPhoto ? "size-7" : "size-9",
          )}
        >
          <MoodFace mood={entry.mood} />
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className={cn("font-heading", featured ? "text-lg sm:text-xl" : "text-base")}>{meta.label}</span>
          <span className={cn("truncate text-xs", onPhoto ? "text-white/85" : "text-muted-foreground")}>
            {date}
          </span>
        </div>
      </div>

      {entry.note && (
        <p
          className={cn(
            "font-heading leading-snug",
            featured ? "line-clamp-3 text-base sm:text-lg" : "line-clamp-2 text-sm",
            onPhoto ? "text-white/95" : "text-foreground/80",
          )}
        >
          “{entry.note}”
        </p>
      )}

      {entry.song && (
        <span
          className={cn(
            "flex w-fit max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-xs",
            onPhoto ? "bg-white/20 text-white backdrop-blur-sm" : "bg-surface/70 text-foreground",
          )}
        >
          <Music2 aria-hidden className="size-3 shrink-0" />
          <span className="truncate">
            {featured ? `${entry.song.title} · ${entry.song.artist}` : entry.song.title}
          </span>
        </span>
      )}
    </div>
  );
}

function Doodles() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 font-heading text-foreground/15">
      <span className="absolute top-3 left-4 rotate-12 text-2xl">♡</span>
      <span className="absolute top-8 left-12 text-sm">✦</span>
      <span className="absolute right-12 bottom-14 -rotate-12 text-lg">✿</span>
    </span>
  );
}

export function FavoriteCardSkeleton({ tall = false, featured = false }: { tall?: boolean; featured?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-3xl bg-muted",
        featured && "col-span-2 row-span-2",
        tall && !featured && "row-span-2",
      )}
    />
  );
}
