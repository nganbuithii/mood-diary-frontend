import { useEffect, useState } from "react";
import type { Mood } from "@/features/diary/types/mood.types";
import {
  defaultDeliveryDay,
  earliestDeliveryDay,
  latestDeliveryDay,
} from "@/features/letters/utils/letter-dates";
import { formatDateKey, tryParseDateKey } from "@/lib/date";

const DRAFT_KEY = "moodiary-letter-draft";
const SAVE_DELAY_MS = 600;

export interface LetterDraft {
  body: string;
  mood: Mood | null;
  deliveryDay: Date;
}

interface StoredDraft {
  body: string;
  mood: Mood | null;
  deliveryDay: string;
}

export function readLetterDraft(today: Date): LetterDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredDraft;
    if (!stored.body?.trim()) return null;
    const day = tryParseDateKey(stored.deliveryDay);
    const isValidDay = day && day >= earliestDeliveryDay(today) && day <= latestDeliveryDay(today);
    return { body: stored.body, mood: stored.mood, deliveryDay: isValidDay ? day : defaultDeliveryDay(today) };
  } catch {
    return null;
  }
}

export function clearLetterDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage blocked: nothing to clear
  }
}

export function useAutosaveLetterDraft(current: LetterDraft, { paused = false } = {}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      try {
        if (current.body.trim()) {
          const stored: StoredDraft = {
            body: current.body,
            mood: current.mood,
            deliveryDay: formatDateKey(current.deliveryDay),
          };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(stored));
          setIsSaved(true);
        } else {
          localStorage.removeItem(DRAFT_KEY);
          setIsSaved(false);
        }
      } catch {
        setIsSaved(false);
      }
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [current.body, current.mood, current.deliveryDay, paused]);

  return isSaved;
}
