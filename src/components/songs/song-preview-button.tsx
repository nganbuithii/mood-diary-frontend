"use client";

import { Pause, Play } from "lucide-react";
import { cn } from "cn";

import { useSongPreview } from "@/features/songs/hooks/use-song-preview";
import type { Song } from "@/features/songs/types/song.types";

export function previewLabel(song: Song, isPlaying: boolean) {
  return isPlaying ? `Pause preview of ${song.title}` : `Play a preview of ${song.title}`;
}

export function PlayPauseIcon({ isPlaying, className }: { isPlaying: boolean; className?: string }) {
  return isPlaying ? (
    <Pause aria-hidden className={cn("fill-current", className)} />
  ) : (
    <Play aria-hidden className={cn("translate-x-px fill-current", className)} />
  );
}

export function SongPreviewButton({ song, className }: { song: Song; className?: string }) {
  const { isPlaying, toggle } = useSongPreview(song.previewUrl);

  return (
    <button
      type="button"
      aria-pressed={isPlaying}
      aria-label={previewLabel(song, isPlaying)}
      onClick={toggle}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur-sm transition-all outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
        isPlaying && "text-primary-hover",
        className,
      )}
    >
      <PlayPauseIcon isPlaying={isPlaying} className="size-3.5" />
    </button>
  );
}
