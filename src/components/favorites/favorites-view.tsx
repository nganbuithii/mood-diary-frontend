"use client";

import { useState } from "react";
import { cn } from "cn";

import { ErrorState } from "@/components/ui/empty-state";
import { LoadMoreFooter } from "@/components/ui/load-more-footer";
import { PageShell } from "@/components/layout/page-shell";
import { FavoritesEmptyState } from "@/components/favorites/favorites-empty-state";
import { FAVORITES_GRID_CLASS, FavoriteCard, FavoriteCardSkeleton } from "@/components/favorites/favorite-card";
import { FavoritesHero, type FavoritesStats } from "@/components/favorites/favorites-hero";
import { MoodAvatar } from "@/components/mood-diary/mood-avatar";
import { MOOD_OPTIONS } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";
import type { DiaryEntryDto } from "@/features/diary/types/diary-entry.types";
import { useDiaryFeed } from "@/features/diary/hooks/use-diary-feed";

const PAGE_SIZE = 16;
// Mirrors the bento spans in FavoriteCard: spotlight, then a mix of tall and short tiles.
const SKELETON_LAYOUT = [
  { featured: true },
  { tall: true },
  {},
  {},
  { tall: true },
  {},
  { tall: true },
  {},
];

function getStats(entries: DiaryEntryDto[], hasMore: boolean): FavoritesStats {
  const moodCounts = new Map<Mood, number>();
  for (const entry of entries) moodCounts.set(entry.mood, (moodCounts.get(entry.mood) ?? 0) + 1);
  const topMood = hasMore ? undefined : [...moodCounts].sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    count: entries.length,
    hasMore,
    songCount: entries.filter((entry) => entry.song !== null).length,
    topMood,
  };
}

export function FavoritesView() {
  const [mood, setMood] = useState<Mood>();
  const {
    data,
    isPending,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useDiaryFeed({ favorite: true, mood }, PAGE_SIZE);

  const entries = data?.pages.flatMap((page) => page.items) ?? [];
  // Stats describe the whole box, so they're skipped while a mood filter narrows it down.
  const stats = data && !mood ? getStats(entries, hasNextPage) : undefined;

  return (
    <PageShell glows={[]}>
      <FavoritesHero stats={stats} />

      <VibeFilter value={mood} onChange={setMood} />

      {isError && !data ? (
        <ErrorState message="Couldn't open your treasure box. Please try again." onRetry={() => refetch()} />
      ) : isPending ? (
        <div className={FAVORITES_GRID_CLASS}>
          {SKELETON_LAYOUT.map((props, index) => (
            <FavoriteCardSkeleton key={index} {...props} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <FavoritesEmptyState filtered={Boolean(mood)} onClearFilter={() => setMood(undefined)} />
      ) : (
        <>
          <div className={FAVORITES_GRID_CLASS}>
            {entries.map((entry, index) => (
              <FavoriteCard key={entry.id} entry={entry} featured={index === 0} />
            ))}
          </div>

          <LoadMoreFooter
            className="py-2"
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            fetchNextPage={fetchNextPage}
            errorText="Couldn't load more treasures."
            endText={<p className="font-heading text-base text-muted-foreground">♡ ✦ that&apos;s the whole box ✦ ♡</p>}
          />
        </>
      )}
    </PageShell>
  );
}

function VibeFilter({ value, onChange }: { value?: Mood; onChange: (mood?: Mood) => void }) {
  const bubbleClass =
    "flex shrink-0 items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:transition-none";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="font-heading text-lg text-foreground">Filter by vibe</span>
      <div
        role="radiogroup"
        aria-label="Filter favorites by mood"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <button
          type="button"
          role="radio"
          aria-checked={!value}
          onClick={() => onChange(undefined)}
          className={cn(
            bubbleClass,
            "pl-3.5",
            !value
              ? "bg-foreground text-surface shadow-sm"
              : "bg-surface text-muted-foreground ring-1 ring-border/60 hover:text-foreground",
          )}
        >
          All ♡
        </button>
        {MOOD_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(isSelected ? undefined : option.value)}
              className={cn(
                bubbleClass,
                isSelected
                  ? cn(option.bgClass, "font-medium text-foreground shadow-sm ring-2 ring-foreground/70")
                  : "bg-surface text-muted-foreground ring-1 ring-border/60 hover:-translate-y-0.5 hover:text-foreground",
              )}
            >
              <MoodAvatar
                mood={option.value}
                className={cn("size-7 p-0.5 transition-transform", isSelected && "scale-110 motion-reduce:scale-100")}
              />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
