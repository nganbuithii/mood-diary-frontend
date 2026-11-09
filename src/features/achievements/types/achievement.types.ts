export type AchievementId =
  | "pages"
  | "streak"
  | "photos"
  | "songs"
  | "favorites"
  | "letters"
  | "rainbow"
  | "comeback";

export interface AchievementDto {
  id: string;
  /** Number of tiers reached; never goes down, even if pages are deleted later. */
  level: number;
  /** Highest level the user has already looked at, so anything above it is "new". */
  seenLevel: number;
  value: number;
  tiers: number[];
}

export interface MonthlyBadgeDto {
  month: string;
  pages: number;
  goal: number;
  earned: boolean;
}

export interface AchievementStatsDto {
  currentStreak: number;
  longestStreak: number;
  totalPages: number;
}

export interface AchievementsDto {
  stats: AchievementStatsDto;
  achievements: AchievementDto[];
  monthly: MonthlyBadgeDto[];
}

export type KnownAchievementDto = AchievementDto & { id: AchievementId };
