"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "cn";

import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { MemoryTile, MemoryTileSkeleton } from "@/components/memories/memory-tile";
import { useDiaryFeed } from "@/features/diary/hooks/use-diary-feed";

const RECENT_LIMIT = 4;

type FeedTab = "mine" | "friends";

const TABS: { id: FeedTab; label: string }[] = [
  { id: "mine", label: "♡ My little world" },
  { id: "friends", label: "୨୧ Friends' moments" },
];

export function RecentMemoriesSection() {
  const [tab, setTab] = useState<FeedTab>("mine");

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px flex-1 bg-border" />
        <h2 className="shrink-0 font-heading text-lg text-foreground sm:text-xl">
          <span aria-hidden>♡</span> Recent memories <span aria-hidden>♡</span>
        </h2>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>

      <div
        role="tablist"
        aria-label="Memories feed"
        className="flex justify-center gap-2"
      >
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full border border-transparent px-4 py-1.5 text-sm text-muted-foreground transition-all",
                isActive
                  ? "border-border bg-surface text-foreground shadow-sm"
                  : "hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "mine" ? (
        <MyRecentMemories />
      ) : (
        <EmptyState
          className="py-10"
          illustration={<span aria-hidden className="text-2xl">✿</span>}
          title="Friends' moments are coming soon"
          description="Once you add friends, their little diary pages will show up here."
        />
      )}
    </section>
  );
}

function MyRecentMemories() {
  // Same feed as /memories, just the first page.
  const { data, isPending, isError, refetch } = useDiaryFeed({}, RECENT_LIMIT);
  const entries = data?.pages[0]?.items ?? [];

  if (isError && !data) {
    return (
      <ErrorState message="Couldn't load your memories right now." onRetry={() => refetch()} className="py-10" />
    );
  }

  if (!isPending && entries.length === 0) {
    return (
      <EmptyState
        className="py-10"
        illustration={<span aria-hidden className="text-2xl">📔</span>}
        title="No memories yet"
        description="Every day you write becomes a little polaroid here."
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: RECENT_LIMIT }, (_, index) => <MemoryTileSkeleton key={index} />)
          : entries.map((entry, index) => <MemoryTile key={entry.id} entry={entry} index={index} />)}
      </div>
      {!isPending && (
        <Link
          href="/memories"
          className="rounded-full px-3 py-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          See all memories <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
