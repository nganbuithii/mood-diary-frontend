"use client";

import { useRef, useState } from "react";
import { ChevronUp, Music2, Pause, Play, Search, X } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSearchSongs } from "@/features/songs/hooks/use-search-songs";
import type { Song } from "@/features/songs/types/song.types";
import { ApiError } from "@/lib/api/http-error";

interface SongPickerProps {
  value: Song | null;
  onChange: (song: Song | null) => void;
  disabled?: boolean;
}

export function SongPicker({ value, onChange, disabled = false }: SongPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: songs, error, isPending, isFetching, isQueryReady } = useSearchSongs(query);

  const closeList = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleSelect = (song: Song) => {
    onChange(song);
    closeList();
  };

  if (value && !isOpen) {
    return (
      <SelectedSongCard
        song={value}
        disabled={disabled}
        onChangeSong={() => setIsOpen(true)}
        onRemove={() => onChange(null)}
      />
    );
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-surface px-3 py-2.5 text-left transition-colors outline-none hover:border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/30 text-foreground transition-transform group-hover:-rotate-6">
          <Music2 className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-medium text-foreground">Add a song for today</span>
          <span className="text-xs text-muted-foreground">
            A little tune that sounds like your day <span aria-hidden>♪</span>
          </span>
        </span>
      </button>
    );
  }

  const renderResults = () => {
    if (!isQueryReady) {
      return <StatusMessage>Type a song or artist to start searching ♪</StatusMessage>;
    }
    if (error) {
      return (
        <StatusMessage>
          {error instanceof ApiError ? error.message : "Couldn't search songs. Please try again."}
        </StatusMessage>
      );
    }
    if (isPending) {
      return (
        <div className="flex justify-center py-6">
          <Spinner size="sm" />
        </div>
      );
    }
    if (songs.length === 0) {
      return <StatusMessage>No songs found. Try another name?</StatusMessage>;
    }

    return (
      <ul className="-mx-1 flex max-h-52 flex-col overflow-y-auto">
        {songs.map((song) => {
          const isSelected = value?.id === song.id;
          return (
            <li key={song.id}>
              <button
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => handleSelect(song)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-1 py-1.5 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted/60",
                  isSelected && "bg-primary/10 hover:bg-primary/15",
                )}
              >
                <SongArtwork url={song.artworkUrl} className="size-10 rounded-lg" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">{song.title}</span>
                  <span className="truncate text-xs text-muted-foreground">{song.artist}</span>
                </span>
                {isSelected && (
                  <span aria-hidden className="shrink-0 pr-1 text-primary-hover">
                    ♥
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a song or artist..."
            aria-label="Search songs"
            className="pr-8 pl-8"
          />
          {isFetching && (
            <Spinner size="sm" className="absolute top-1/2 right-2.5 -translate-y-1/2" />
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close song list"
          onClick={closeList}
        >
          <ChevronUp />
        </Button>
      </div>

      {renderResults()}
    </div>
  );
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

function SongArtwork({ url, className }: { url: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-accent-blue/30 text-foreground shadow-sm",
        className,
      )}
    >
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <Music2 className="size-4" />
      )}
    </span>
  );
}

interface SelectedSongCardProps {
  song: Song;
  disabled: boolean;
  onChangeSong: () => void;
  onRemove: () => void;
}

function SelectedSongCard({ song, disabled, onChangeSong, onRemove }: SelectedSongCardProps) {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePreview = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => toast.error("Couldn't play this preview."));
    } else {
      audio.pause();
    }
  };

  const vinyl = (
    <>
      <span className="absolute inset-1 rounded-full border border-surface/15" />
      <SongArtwork url={song.artworkUrl} className="relative size-7 rounded-full shadow-none" />
    </>
  );
  const vinylClassName =
    "relative flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground shadow-md";

  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 pt-4 shadow-sm">
      <span
        aria-hidden
        className="absolute -top-1.5 left-6 h-3 w-10 -rotate-3 rounded-[2px] bg-accent-green/60"
      />

      {song.previewUrl ? (
        <button
          type="button"
          onClick={togglePreview}
          aria-label={isPlaying ? `Pause preview of ${song.title}` : `Play a preview of ${song.title}`}
          className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span
            className={cn(
              vinylClassName,
              "transition-transform group-hover:scale-105",
              isPlaying && "motion-safe:animate-[spin_4s_linear_infinite]",
            )}
          >
            {vinyl}
          </span>
          <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-surface">
            {isPlaying ? <Pause className="size-2.5 fill-current" /> : <Play className="size-2.5 translate-x-px fill-current" />}
          </span>
          <audio
            ref={audioRef}
            src={song.previewUrl}
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </button>
      ) : (
        <span aria-hidden className={vinylClassName}>
          {vinyl}
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
