import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLetter, deleteLetter, listLetters, openLetter } from "@/features/letters/api/letters.api";
import { LETTER_STATUS } from "@/features/letters/constants/letter.constants";
import { letterKeys } from "@/features/letters/constants/letter-query-keys";
import { MINUTE_MS } from "@/lib/constants/time";

export function useLetters() {
  return useQuery({
    queryKey: letterKeys.list(),
    queryFn: listLetters,
    // A sealed letter turns "ready" with time, not with a mutation.
    refetchInterval: MINUTE_MS,
  });
}

export function useReadyLetterCount() {
  const { data } = useLetters();
  return data?.filter((letter) => letter.status === LETTER_STATUS.READY).length ?? 0;
}

export function useRefreshLetters() {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.invalidateQueries({ queryKey: letterKeys.list() }), [queryClient]);
}

export function useCreateLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLetter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: letterKeys.list() }),
  });
}

export function useOpenedLetter(id: string) {
  return useQuery({
    queryKey: letterKeys.opened(id),
    queryFn: () => openLetter(id),
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useOpenLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: openLetter,
    onSuccess: (letter) => {
      queryClient.setQueryData(letterKeys.opened(letter.id), letter);
      queryClient.invalidateQueries({ queryKey: letterKeys.list() });
    },
  });
}

export function useDeleteLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLetter,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: letterKeys.opened(id) });
      queryClient.invalidateQueries({ queryKey: letterKeys.list() });
    },
  });
}
