import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { searchSongs } from "@/features/songs/api/songs.api";
import { songKeys } from "@/features/songs/constants/song-query-keys";
import { MINUTE_MS } from "@/lib/constants/time";

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
    queryKey: songKeys.search(debouncedQuery),
    queryFn: () => searchSongs(debouncedQuery),
    enabled: isQueryReady,
    staleTime: 5 * MINUTE_MS,
    retry: false,
    placeholderData: keepPreviousData,
  });

  return { ...result, isQueryReady };
}
