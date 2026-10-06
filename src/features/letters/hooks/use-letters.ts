import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLetter, deleteLetter, listLetters, openLetter } from "@/features/letters/api/letters.api";
import { LETTER_STATUS } from "@/features/letters/constants/letter.constants";
import { MINUTE_MS } from "@/lib/constants/time";

const LETTERS_KEY = ["letters"] as const;

export function useLetters() {
  return useQuery({
    queryKey: LETTERS_KEY,
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
  return useCallback(() => queryClient.invalidateQueries({ queryKey: LETTERS_KEY }), [queryClient]);
}

export function useCreateLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLetter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LETTERS_KEY }),
  });
}

export function useOpenLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: openLetter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LETTERS_KEY }),
  });
}

export function useDeleteLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLetter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LETTERS_KEY }),
  });
}
