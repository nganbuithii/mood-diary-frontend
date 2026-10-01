"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MemoryFilters } from "@/components/memories/memory-filters";
import { MemoryTile, MemoryTileSkeleton } from "@/components/memories/memory-tile";
import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";
import { parseDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";
import { useDiaryFeed } from "@/features/diary/hooks/use-diary-feed";
import { useLoadMoreOnScroll } from "@/lib/hooks/use-load-more-on-scroll";

type SearchParams = Promise<{
  mood?: string | string[];
  month?: string | string[];
  favorite?: string | string[];
}>;

// Anything malformed in the URL is ignored rather than sent to the API.
function parseFilters(params: Awaited<SearchParams>): DiaryFeedFilters {
  const mood = typeof params.mood === "string" && params.mood in MOOD_META ? (params.mood as Mood) : undefined;
  const month =
    typeof params.month === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(params.month)
      ? params.month
      : undefined;
  const favorite = params.favorite === "true" || undefined;
  return { mood, month, favorite };
}

function groupByMonth(entries: DiaryEntryDto[]) {
  const groups: { key: string; label: string; entries: DiaryEntryDto[] }[] = [];
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    let group = groups.at(-1);
    if (group?.key !== key) {
      group = {
        key,
        label: parseDateKey(entry.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        entries: [],
      };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}

const GRID_CLASS = "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4";

export default function MemoriesPage({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const filters = parseFilters(use(searchParams));
  const {
    data,
    isPending,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useDiaryFeed(filters);

  const entries = data?.pages.flatMap((page) => page.items) ?? [];
  const groups = groupByMonth(entries);

  const setFilters = (next: DiaryFeedFilters) => {
    const params = new URLSearchParams();
    if (next.mood) params.set("mood", next.mood);
    if (next.month) params.set("month", next.month);
    if (next.favorite) params.set("favorite", "true");
    const query = params.toString();
    router.replace(query ? `/memories?${query}` : "/memories", { scroll: false });
  };

  const sentinelRef = useLoadMoreOnScroll({
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  });

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-accent-blue/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-secondary/15 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
            <span aria-hidden>♡</span> {filters.favorite ? "Favorite memories" : "Memories"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {filters.favorite
              ? "The pages you never want to lose, all in one place."
              : "Every little page you've kept, tucked into one scrapbook."}
          </p>
        </header>

        <MemoryFilters value={filters} onChange={setFilters} />

        {/* Only a failed first load replaces the grid; later failures keep what's already loaded. */}
        {isError && !data ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load your memories. Please try again.
            </p>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isPending ? (
          <div className={GRID_CLASS}>
            {Array.from({ length: 8 }, (_, index) => (
              <MemoryTileSkeleton key={index} />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState filters={filters} onClearFilters={() => setFilters({})} />
        ) : (
          <div className="flex flex-col gap-10">
            {groups.map((group, groupIndex) => (
              <section key={group.key} aria-labelledby={`month-${group.key}`} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <h2 id={`month-${group.key}`} className="shrink-0 font-heading text-lg text-foreground sm:text-xl">
                    ୨୧ {group.label}
                  </h2>
                  <span aria-hidden className="h-px flex-1 border-t border-dashed border-border" />
                  {/* The last month may continue on the next page, so its count isn't final yet. */}
                  {(groupIndex < groups.length - 1 || !hasNextPage) && (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {group.entries.length} {group.entries.length === 1 ? "page" : "pages"}
                    </span>
                  )}
                </div>
                <div className={GRID_CLASS}>
                  {group.entries.map((entry, index) => (
                    <MemoryTile key={entry.id} entry={entry} index={index} />
                  ))}
                </div>
              </section>
            ))}

            <div ref={sentinelRef} className="flex justify-center py-4">
              {isFetchingNextPage ? (
                <Spinner />
              ) : isFetchNextPageError ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-sm text-muted-foreground">Couldn&apos;t load more memories.</p>
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
                <p className="text-sm text-muted-foreground">✿ That&apos;s every page so far ✿</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({
  filters,
  onClearFilters,
}: {
  filters: DiaryFeedFilters;
  onClearFilters: () => void;
}) {
  // Favorites alone gets its own hint; combined with other filters it's just "nothing matches".
  const favoritesOnly = filters.favorite && !filters.mood && !filters.month;
  const hasFilters = Boolean(filters.mood || filters.month || filters.favorite);

  if (favoritesOnly) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
        <span aria-hidden className="text-3xl">
          💗
        </span>
        <p className="font-heading text-lg text-foreground">No favorites yet</p>
        <p className="text-sm text-muted-foreground">
          Tap the ♡ on any memory to keep it here.
        </p>
        <Button type="button" variant="outline" className="rounded-full" onClick={onClearFilters}>
          Browse all memories
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
      <span aria-hidden className="text-3xl">
        {hasFilters ? "🔍" : "📔"}
      </span>
      <p className="font-heading text-lg text-foreground">
        {hasFilters ? "No memories match these filters" : "Your scrapbook is still empty"}
      </p>
      <p className="text-sm text-muted-foreground">
        {hasFilters
          ? "Try another mood or month."
          : "Write about your day and it'll show up here as a little polaroid."}
      </p>
      {hasFilters ? (
        <Button type="button" variant="outline" className="rounded-full" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : (
        <Button className="rounded-full" render={<Link href="/home">Write today&apos;s page ♡</Link>} />
      )}
    </div>
  );
}
