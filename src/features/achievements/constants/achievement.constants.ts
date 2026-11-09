import type { AchievementDto, AchievementId, KnownAchievementDto } from "@/features/achievements/types/achievement.types";

const ACHIEVEMENT_IDS: readonly AchievementId[] = [
  "pages",
  "streak",
  "photos",
  "songs",
  "favorites",
  "letters",
  "rainbow",
  "comeback",
];

export function isKnownAchievement(achievement: AchievementDto): achievement is KnownAchievementDto {
  return (ACHIEVEMENT_IDS as readonly string[]).includes(achievement.id);
}

export function isNewAchievement(achievement: AchievementDto) {
  return achievement.level > achievement.seenLevel;
}

/** The number printed on the badge: the tier just reached, or the first one to aim for. */
export function badgeNumber({ level, tiers }: AchievementDto) {
  return tiers[Math.max(level - 1, 0)];
}

export function nextTier({ level, tiers }: AchievementDto): number | null {
  return tiers[level] ?? null;
}
