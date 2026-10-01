"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FAVORITES_GRID_CLASS, FavoriteCard, FavoriteCardSkeleton } from "@/components/favorites/favorite-card";
import { FavoritesHero, type FavoritesStats } from "@/components/favorites/favorites-hero";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_OPTIONS, type Mood } from "@/components/mood-diary/mood.constants";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { useDiaryFeed } from "@/features/diary/hooks/use-diary-feed";
import { useLoadMoreOnScroll } from "@/lib/hooks/use-load-more-on-scroll";

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

export default function FavoritesPage() {
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

  const sentinelRef = useLoadMoreOnScroll({
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  const entries = data?.pages.flatMap((page) => page.items) ?? [];
  // Stats describe the whole box, so they're skipped while a mood filter narrows it down.
  const stats = data && !mood ? getStats(entries, hasNextPage) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
      <FavoritesHero stats={stats} />

      <VibeFilter value={mood} onChange={setMood} />

      {isError && !data ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface/70 px-6 py-16 text-center ring-1 ring-foreground/5">
          <p className="text-sm text-muted-foreground">Couldn&apos;t open your treasure box. Please try again.</p>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className={FAVORITES_GRID_CLASS}>
          {SKELETON_LAYOUT.map((props, index) => (
            <FavoriteCardSkeleton key={index} {...props} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyBox filtered={Boolean(mood)} onClearFilter={() => setMood(undefined)} />
      ) : (
        <>
          <div className={FAVORITES_GRID_CLASS}>
            {entries.map((entry, index) => (
              <FavoriteCard key={entry.id} entry={entry} featured={index === 0} />
            ))}
          </div>

          <div ref={sentinelRef} className="flex justify-center py-2">
            {isFetchingNextPage ? (
              <Spinner />
            ) : isFetchNextPageError ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-muted-foreground">Couldn&apos;t load more treasures.</p>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => fetchNextPage()}>
                  Retry
                </Button>
              </div>
            ) : hasNextPage ? (
              // Fallback for when the observer doesn't fire (e.g. very tall screens).
              <Button type="button" variant="outline" className="rounded-full" onClick={() => fetchNextPage()}>
                Load more <span aria-hidden>♡</span>
              </Button>
            ) : (
              <p className="font-heading text-base text-muted-foreground">♡ ✦ that&apos;s the whole box ✦ ♡</p>
            )}
          </div>
        </>
      )}
    </main>
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
              <span
                className={cn(
                  "size-7 rounded-full p-0.5 transition-transform",
                  option.bgClass,
                  isSelected && "scale-110 motion-reduce:scale-100",
                )}
              >
                <MoodFace mood={option.value} />
              </span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyBox({ filtered, onClearFilter }: { filtered: boolean; onClearFilter: () => void }) {
  return (
    <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-[2rem] bg-surface/70 px-6 py-16 text-center ring-1 ring-foreground/5">
      <div aria-hidden className="relative mb-2 flex size-24 items-center justify-center rounded-3xl bg-primary/20">
        <span className="text-5xl">🎁</span>
        <span className="absolute -top-2 -right-3 rotate-12 font-heading text-2xl text-primary-hover">♡</span>
        <span className="absolute -bottom-1 -left-3 -rotate-12 font-heading text-lg text-secondary">✦</span>
      </div>
      <p className="font-heading text-xl text-foreground">
        {filtered ? "No treasures with this vibe yet" : "Your treasure box is empty"}
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        {filtered
          ? "Try another mood, or heart a few more days."
          : "Tap the ♡ on any memory you never want to lose, and it'll land right here."}
      </p>
      {filtered ? (
        <Button type="button" variant="outline" className="rounded-full" onClick={onClearFilter}>
          Show all treasures
        </Button>
      ) : (
        <Button className="rounded-full" render={<Link href="/memories">Find a memory to keep ♡</Link>} />
      )}
    </div>
  );
}
