"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/empty-state";
import { LoadMoreFooter } from "@/components/ui/load-more-footer";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { MemoriesEmptyState } from "@/components/memories/memories-empty-state";
import { MemoryFilters } from "@/components/memories/memory-filters";
import { MemoryTile, MemoryTileSkeleton } from "@/components/memories/memory-tile";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";
import { formatDate, parseDateKey, tryParseMonthKey } from "@/lib/date";
import { pluralize } from "@/lib/utils";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import type { DiaryFeedFilters } from "@/features/diary/api/diary-feed.types";
import { useDiaryFeed } from "@/features/diary/hooks/use-diary-feed";

type SearchParams = Promise<{
  mood?: string | string[];
  month?: string | string[];
  favorite?: string | string[];
}>;

// Anything malformed in the URL is ignored rather than sent to the API.
function parseFilters(params: Awaited<SearchParams>): DiaryFeedFilters {
  const mood = typeof params.mood === "string" && params.mood in MOOD_META ? (params.mood as Mood) : undefined;
  const month = tryParseMonthKey(params.month) ? (params.month as string) : undefined;
  const favorite = params.favorite === "true" || undefined;
  return { mood, month, favorite };
}

function groupByMonth(entries: DiaryEntryDto[]) {
  const groups: { key: string; label: string; entries: DiaryEntryDto[] }[] = [];
  for (const entry of entries) {
    const key = entry.date.slice(0, 7);
    let group = groups.at(-1);
    if (group?.key !== key) {
      group = { key, label: formatDate(parseDateKey(entry.date), "monthYear"), entries: [] };
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

  return (
    <PageShell glows={["bg-accent-blue/20", "bg-secondary/15"]}>
      <PageHeader
        title={
          <>
            <span aria-hidden>♡</span> {filters.favorite ? "Favorite memories" : "Memories"}
          </>
        }
        description={
          filters.favorite
            ? "The pages you never want to lose, all in one place."
            : "Every little page you've kept, tucked into one scrapbook."
        }
      />

      <MemoryFilters value={filters} onChange={setFilters} />

      {/* Only a failed first load replaces the grid; later failures keep what's already loaded. */}
      {isError && !data ? (
        <ErrorState message="Couldn't load your memories. Please try again." onRetry={() => refetch()} />
      ) : isPending ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 8 }, (_, index) => (
            <MemoryTileSkeleton key={index} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <MemoriesEmptyState filters={filters} onClearFilters={() => setFilters({})} />
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
                    {pluralize(group.entries.length, "page")}
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

          <LoadMoreFooter
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isFetchNextPageError={isFetchNextPageError}
            fetchNextPage={fetchNextPage}
            errorText="Couldn't load more memories."
            endText={<p className="text-sm text-muted-foreground">✿ That&apos;s every page so far ✿</p>}
          />
        </div>
      )}
    </PageShell>
  );
}
