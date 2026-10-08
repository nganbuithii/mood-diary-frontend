import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface FavoritesEmptyStateProps {
  filtered: boolean;
  onClearFilter: () => void;
}

export function FavoritesEmptyState({ filtered, onClearFilter }: FavoritesEmptyStateProps) {
  return (
    <EmptyState
      className="py-16"
      illustration={<GiftIllustration />}
      title={filtered ? "No treasures with this vibe yet" : "Your treasure box is empty"}
      description={
        filtered
          ? "Try another mood, or heart a few more days."
          : "Tap the ♡ on any memory you never want to lose, and it'll land right here."
      }
      action={
        filtered ? (
          <Button type="button" variant="outline" className="rounded-full" onClick={onClearFilter}>
            Show all treasures
          </Button>
        ) : (
          <Button className="rounded-full" render={<Link href="/memories">Find a memory to keep ♡</Link>} />
        )
      }
    />
  );
}

function GiftIllustration() {
  return (
    <div aria-hidden className="relative mb-2 flex size-24 items-center justify-center rounded-3xl bg-primary/20">
      <span className="text-5xl">🎁</span>
      <span className="absolute -top-2 -right-3 rotate-12 font-heading text-2xl text-primary-hover">♡</span>
      <span className="absolute -bottom-1 -left-3 -rotate-12 font-heading text-lg text-secondary">✦</span>
    </div>
  );
}
