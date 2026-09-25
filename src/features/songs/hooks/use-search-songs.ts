import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { searchSongs } from "@/features/songs/api/search-songs.api";

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export function useSearchSongs(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query.trim());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const isQueryReady = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const result = useQuery({
    queryKey: ["songs", "search", debouncedQuery],
    queryFn: () => searchSongs(debouncedQuery),
    enabled: isQueryReady,
    staleTime: 5 * 60_000,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return { ...result, isQueryReady };
}
