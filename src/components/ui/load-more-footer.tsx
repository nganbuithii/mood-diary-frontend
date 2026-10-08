"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLoadMoreOnScroll } from "@/lib/hooks/use-load-more-on-scroll";

interface LoadMoreFooterProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
  errorText: string;
  endText: React.ReactNode;
  className?: string;
}

export function LoadMoreFooter({ errorText, endText, className, ...query }: LoadMoreFooterProps) {
  const sentinelRef = useLoadMoreOnScroll(query);
  const loadMore = () => query.fetchNextPage();

  return (
    <div ref={sentinelRef} className={cn("flex justify-center py-4", className)}>
      {query.isFetchingNextPage ? (
        <Spinner />
      ) : query.isFetchNextPageError ? (
        <div role="alert" className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">{errorText}</p>
          <Button type="button" variant="outline" className="rounded-full" onClick={loadMore}>
            Retry
          </Button>
        </div>
      ) : query.hasNextPage ? (
        <Button type="button" variant="outline" className="rounded-full" onClick={loadMore}>
          Load more <span aria-hidden>♡</span>
        </Button>
      ) : (
        endText
      )}
    </div>
  );
}
