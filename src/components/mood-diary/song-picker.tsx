"use client";

import { useState } from "react";
import { ChevronUp, Music2, Search, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";
import { SONG_SUGGESTIONS, type Song } from "@/components/mood-diary/song.constants";

interface SongPickerProps {
  mood: Mood | null;
  value: Song | null;
  onChange: (song: Song | null) => void;
  disabled?: boolean;
}

export function SongPicker({ mood, value, onChange, disabled = false }: SongPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const keyword = query.trim().toLowerCase();
  const songs = SONG_SUGGESTIONS.filter((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(keyword),
  ).sort((a, b) => Number(b.mood === mood) - Number(a.mood === mood));

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
            className="pl-8"
          />
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

      {songs.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          No songs found. Try another name?
        </p>
      ) : (
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
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground shadow-sm",
                      MOOD_META[song.mood].bgClass,
                    )}
                  >
                    <Music2 className="size-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">{song.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{song.artist}</span>
                  </span>
                  {song.mood === mood && (
                    <span className="shrink-0 rounded-full bg-secondary/40 px-2 py-0.5 text-[0.65rem] font-medium text-foreground">
                      for you
                    </span>
                  )}
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
      )}
    </div>
  );
}

interface SelectedSongCardProps {
  song: Song;
  disabled: boolean;
  onChangeSong: () => void;
  onRemove: () => void;
}

function SelectedSongCard({ song, disabled, onChangeSong, onRemove }: SelectedSongCardProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 pt-4 shadow-sm">
      <span
        aria-hidden
        className="absolute -top-1.5 left-6 h-3 w-10 -rotate-3 rounded-[2px] bg-accent-green/60"
      />

      <span
        aria-hidden
        className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-foreground shadow-md"
      >
        <span className="absolute inset-1.5 rounded-full border border-surface/15" />
        <span className="absolute inset-3 rounded-full border border-surface/10" />
        <span
          className={cn(
            "relative flex size-5 items-center justify-center rounded-full",
            MOOD_META[song.mood].bgClass,
          )}
        >
          <span className="size-1.5 rounded-full bg-foreground" />
        </span>
      </span>

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
        >
          <Music2 />
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
