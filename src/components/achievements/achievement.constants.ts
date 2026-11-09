import type { AchievementId } from "@/features/achievements/types/achievement.types";
import { pluralize } from "@/lib/utils";

export interface AchievementMeta {
  image: string;
  name: string;
  toneClass: string;
  unit: string;
  goal: (tier: number) => string;
  done: (tier: number) => string;
}

export const ACHIEVEMENT_META: Record<AchievementId, AchievementMeta> = {
  pages: {
    image: "/images/achievements/writing.jpg",
    name: "Storyteller",
    toneClass: "fill-secondary",
    unit: "page",
    goal: (tier) => (tier === 1 ? "Write your first page" : `Write ${pluralize(tier, "page")}`),
    done: (tier) => `Wrote ${pluralize(tier, "page")}`,
  },
  streak: {
    image: "/images/achievements/streak.jpg",
    name: "Warm streak",
    toneClass: "fill-primary",
    unit: "day",
    goal: (tier) => `Write ${tier} days in a row, whenever you're ready`,
    done: (tier) => `Wrote ${tier} days in a row`,
  },
  photos: {
    image: "/images/achievements/camera.jpg",
    name: "Shutterbug",
    toneClass: "fill-accent-blue",
    unit: "photo page",
    goal: (tier) => (tier === 1 ? "Add a photo to any page" : `Add photos to ${tier} pages`),
    done: (tier) => `Added photos to ${pluralize(tier, "page")}`,
  },
  songs: {
    image: "/images/achievements/music.jpg",
    name: "Soundtrack",
    toneClass: "fill-accent-green",
    unit: "song",
    goal: (tier) => (tier === 1 ? "Pick a song for any day" : `Give ${tier} days a song`),
    done: (tier) => `Gave ${pluralize(tier, "day")} a song`,
  },
  favorites: {
    image: "/images/achievements/love.jpg",
    name: "Treasure keeper",
    toneClass: "fill-mood-happy",
    unit: "favorite",
    goal: (tier) => (tier === 1 ? "Tap ♡ on a memory you love" : `Keep ${tier} favorite memories`),
    done: (tier) => `Kept ${pluralize(tier, "favorite memory")}`,
  },
  letters: {
    image: "/images/achievements/rose.jpg",
    name: "Dear future me",
    toneClass: "fill-mood-neutral",
    unit: "letter",
    goal: (tier) => (tier === 1 ? "Write a letter to future you" : `Write ${tier} letters to future you`),
    done: (tier) => `Wrote ${pluralize(tier, "letter")} to future you`,
  },
  rainbow: {
    image: "/images/achievements/clover.jpg",
    name: "All the feels",
    toneClass: "fill-mood-sad",
    unit: "mood",
    goal: (tier) => `Write pages in ${tier} different moods`,
    done: (tier) => `Wrote pages in ${tier} different moods`,
  },
  comeback: {
    image: "/images/achievements/chill.jpg",
    name: "Back again",
    toneClass: "fill-mood-very-sad",
    unit: "comeback",
    goal: (tier) =>
      tier === 1 ? "Take a little break, then come back to write" : `Come back after a break ${tier} times`,
    done: (tier) => `Came back ${pluralize(tier, "time")} after a break. Rest is part of it too`,
  },
};

export const MONTH_THEME: { emoji: string; toneClass: string }[] = [
  { emoji: "❄️", toneClass: "fill-accent-blue" },
  { emoji: "💝", toneClass: "fill-primary" },
  { emoji: "🌸", toneClass: "fill-mood-happy" },
  { emoji: "🌷", toneClass: "fill-secondary" },
  { emoji: "🌼", toneClass: "fill-mood-neutral" },
  { emoji: "🍉", toneClass: "fill-accent-green" },
  { emoji: "🌻", toneClass: "fill-mood-neutral" },
  { emoji: "🌊", toneClass: "fill-mood-very-sad" },
  { emoji: "🍂", toneClass: "fill-mood-sad" },
  { emoji: "🎃", toneClass: "fill-primary" },
  { emoji: "🍁", toneClass: "fill-mood-very-happy" },
  { emoji: "🎄", toneClass: "fill-accent-green" },
];
