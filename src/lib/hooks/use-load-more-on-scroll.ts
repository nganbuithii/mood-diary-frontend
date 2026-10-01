import { useEffect, useRef } from "react";

interface LoadMoreOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
}

/** Returns a ref for a sentinel element; the next page loads shortly before it scrolls into view. */
export function useLoadMoreOnScroll<T extends Element = HTMLDivElement>({
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
}: LoadMoreOptions) {
  const sentinelRef = useRef<T>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "400px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  return sentinelRef;
}
