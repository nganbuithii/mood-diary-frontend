"use client";

import { useState } from "react";
import { ChevronUp, Music2, Search } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SelectedSongCard } from "@/components/songs/selected-song-card";
import { SongArtwork } from "@/components/songs/song-artwork";
import { useSearchSongs } from "@/features/songs/hooks/use-search-songs";
import { useTrendingSongs } from "@/features/songs/hooks/use-trending-songs";
import type { Song } from "@/features/songs/types/song.types";
import { getErrorMessage } from "@/lib/api/http-error";

interface SongPickerProps {
  value: Song | null;
  onChange: (song: Song | null) => void;
  disabled?: boolean;
}

export function SongPicker({ value, onChange, disabled = false }: SongPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useSearchSongs(query);
  const trending = useTrendingSongs({ enabled: isOpen });
  // Until the user has typed enough to search, suggest what's trending instead of an empty box.
  const isShowingTrending = !search.isQueryReady;
  const { data: songs, error, isPending } = isShowingTrending ? trending : search;

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
    if (error) {
      const fallback = isShowingTrending
        ? "Couldn't load trending songs. Try searching instead ♪"
        : "Couldn't search songs. Please try again.";
      return <StatusMessage>{getErrorMessage(error, fallback)}</StatusMessage>;
    }
    if (isPending) {
      return (
        <div className="flex justify-center py-6">
          <Spinner size="sm" />
        </div>
      );
    }
    if (songs.length === 0) {
      return (
        <StatusMessage>
          {isShowingTrending
            ? "Type a song or artist to start searching ♪"
            : "No songs found. Try another name?"}
        </StatusMessage>
      );
    }

    return (
      <ul className="-mx-1 flex max-h-52 flex-col overflow-y-auto">
        {songs.map((song, index) => {
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
                {isShowingTrending && (
                  <span className="w-5 shrink-0 text-center font-heading text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                )}
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
          {search.isFetching && (
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

      {isShowingTrending && (
        <p className="px-1 text-xs font-medium text-muted-foreground">
          <span aria-hidden>🔥</span> Trending in Vietnam
        </p>
      )}
      {renderResults()}
    </div>
  );
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{children}</p>;
}
