import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { DiaryFeedFilters } from "@/features/diary/types/diary-feed.types";

interface MemoriesEmptyStateProps {
  filters: DiaryFeedFilters;
  onClearFilters: () => void;
}

export function MemoriesEmptyState({ filters, onClearFilters }: MemoriesEmptyStateProps) {
  const favoritesOnly = filters.favorite && !filters.mood && !filters.month;
  const hasFilters = Boolean(filters.mood || filters.month || filters.favorite);

  if (favoritesOnly) {
    return (
      <EmptyState
        illustration={<Emoji>💗</Emoji>}
        title="No favorites yet"
        description="Tap the ♡ on any memory to keep it here."
        action={<ClearButton onClick={onClearFilters}>Browse all memories</ClearButton>}
      />
    );
  }

  if (hasFilters) {
    return (
      <EmptyState
        illustration={<Emoji>🔍</Emoji>}
        title="No memories match these filters"
        description="Try another mood or month."
        action={<ClearButton onClick={onClearFilters}>Clear filters</ClearButton>}
      />
    );
  }

  return (
    <EmptyState
      illustration={<Emoji>📔</Emoji>}
      title="Your scrapbook is still empty"
      description="Write about your day and it'll show up here as a little polaroid."
      action={<Button className="rounded-full" render={<Link href="/home">Write today&apos;s page ♡</Link>} />}
    />
  );
}

function Emoji({ children }: { children: string }) {
  return (
    <span aria-hidden className="text-3xl">
      {children}
    </span>
  );
}

function ClearButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" variant="outline" className="rounded-full" onClick={onClick}>
      {children}
    </Button>
  );
}
