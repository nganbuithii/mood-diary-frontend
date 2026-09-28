import type { LittleMemoryDto } from "@/features/diary/api/little-memory.types";

// TODO: remove once the little-memory API is integrated.
export const LITTLE_MEMORY_MOCK: LittleMemoryDto = {
  id: "1",
  mood: "VERY_HAPPY",
  date: "2026-06-28",
  content: "Finished my side project today! I'm so happy with how it turned out.",
  photoUrl: null,
  song: null,
};
