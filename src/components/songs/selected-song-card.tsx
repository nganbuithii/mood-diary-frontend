"use client";

import { Search, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { SongArtwork } from "@/components/songs/song-artwork";
import { PlayPauseIcon, previewLabel } from "@/components/songs/song-preview-button";
import { useSongPreview } from "@/features/songs/hooks/use-song-preview";
import type { Song } from "@/features/songs/types/song.types";

const VINYL_CLASS =
  "relative flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground shadow-md dark:bg-background dark:ring-1 dark:ring-border";

interface SelectedSongCardProps {
  song: Song;
  disabled: boolean;
  onChangeSong: () => void;
  onRemove: () => void;
}

export function SelectedSongCard({ song, disabled, onChangeSong, onRemove }: SelectedSongCardProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 pt-4 shadow-sm">
      <span
        aria-hidden
        className="absolute -top-1.5 left-6 h-3 w-10 -rotate-3 rounded-[2px] bg-accent-green/60"
      />

      {song.previewUrl ? (
        <VinylPreviewButton song={song} />
      ) : (
        <span aria-hidden className={VINYL_CLASS}>
          <VinylLabel song={song} />
        </span>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-heading text-[0.7rem] tracking-wide text-muted-foreground uppercase">
          Song of the day
        </span>
        <span className="truncate text-sm font-medium text-foreground">{song.title}</span>
        <span className="truncate text-xs text-muted-foreground">{song.artist}</span>
      </div>

      <div className="flex shrink-0 gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onChangeSong}
          disabled={disabled}
          aria-label="Change song"
          title="Change song"
        >
          <Search />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={disabled}
          aria-label="Remove song"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}

function VinylPreviewButton({ song }: { song: Song }) {
  const { isPlaying, toggle } = useSongPreview(song.previewUrl);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={previewLabel(song, isPlaying)}
      className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <span
        className={cn(
          VINYL_CLASS,
          "transition-transform group-hover:scale-105",
          isPlaying && "motion-safe:animate-[spin_4s_linear_infinite]",
        )}
      >
        <VinylLabel song={song} />
      </span>
      <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-surface">
        <PlayPauseIcon isPlaying={isPlaying} className="size-2.5" />
      </span>
    </button>
  );
}

function VinylLabel({ song }: { song: Song }) {
  return (
    <>
      <span className="absolute inset-1 rounded-full border border-surface/15" />
      <SongArtwork url={song.artworkUrl} className="relative size-7 rounded-full shadow-none" />
    </>
  );
}
