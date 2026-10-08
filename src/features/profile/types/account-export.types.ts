import type { Mood } from "@/features/diary/types/mood.types";

export interface AccountExport {
  format: "mood-diary-export";
  version: number;
  exportedAt: string;
  profile: {
    email: string;
    displayName: string;
    avatarUrl: string | null;
    createdAt: string;
  };
  entries: {
    date: string;
    mood: Mood;
    note: string | null;
    photoUrls: string[];
    isFavorite: boolean;
    song: {
      externalId: string | null;
      title: string;
      artist: string | null;
      artworkUrl: string | null;
      previewUrl: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
  }[];
  letters: {
    status: "sealed" | "ready" | "opened";
    body: string | null;
    moodAtWriting: Mood | null;
    createdAt: string;
    deliverAt: string;
    openedAt: string | null;
  }[];
}
