// Stand-in for the backend until /achievements exists: values are derived from the real account
// export and streak, while reached levels, earned months and "seen" live in localStorage.
import { getMoodStreak } from "@/features/diary/api/diary.api";
import { exportAccount } from "@/features/profile/api/profile.api";
import type { AchievementId, AchievementsDto, MonthlyBadgeDto } from "@/features/achievements/types/achievement.types";
import { ApiError } from "@/lib/api/http-error";
import { daysBetween, parseDateKey } from "@/lib/date";

const ACHIEVEMENT_TIERS: Record<AchievementId, number[]> = {
  pages: [1, 10, 30, 100, 200, 365],
  streak: [3, 7, 14, 30, 60, 100],
  photos: [1, 10, 30, 100],
  songs: [1, 10, 30, 100],
  favorites: [1, 10, 30, 50],
  letters: [1, 3, 5, 10],
  rainbow: [3, 5],
  comeback: [1, 3, 5, 10],
};

const MONTHLY_GOAL = 10;
const BREAK_DAYS = 3;

// Each time the user writes again after at least BREAK_DAYS days away counts once.
function countComebacks(dates: string[]) {
  const days = [...new Set(dates)].sort().map(parseDateKey);
  return days.filter((day, index) => index > 0 && daysBetween(days[index - 1], day) > BREAK_DAYS).length;
}
const STORAGE_KEY = "mood-diary:achievements-mock";

interface StoredAchievements {
  owner: string;
  levels: Record<string, number>;
  seen: Record<string, number>;
  earnedMonths: string[];
}

let currentOwner: string | null = null;

function readState(owner: string): StoredAchievements {
  const empty = { owner, levels: {}, seen: {}, earnedMonths: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as StoredAchievements) : null;
    return stored?.owner === owner ? stored : empty;
  } catch {
    return empty;
  }
}

function writeState(state: StoredAchievements) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: badges still work for this visit.
  }
}

export async function getAchievements(today: string): Promise<AchievementsDto> {
  const [account, streak] = await Promise.all([exportAccount(), getMoodStreak(today)]);
  const { entries, letters } = account;

  const values: Record<AchievementId, number> = {
    pages: entries.length,
    streak: streak.longest,
    photos: entries.filter((entry) => entry.photoUrls.length > 0).length,
    songs: entries.filter((entry) => entry.song !== null).length,
    favorites: entries.filter((entry) => entry.isFavorite).length,
    letters: letters.length,
    rainbow: new Set(entries.map((entry) => entry.mood)).size,
    comeback: countComebacks(entries.map((entry) => entry.date)),
  };

  currentOwner = account.profile.createdAt;
  const state = readState(currentOwner);

  const achievements = (Object.keys(ACHIEVEMENT_TIERS) as AchievementId[]).map((id) => {
    const tiers = ACHIEVEMENT_TIERS[id];
    const reached = tiers.filter((tier) => values[id] >= tier).length;
    const level = Math.max(reached, state.levels[id] ?? 0);
    state.levels[id] = level;
    return { id, level, seenLevel: state.seen[id] ?? 0, value: values[id], tiers };
  });

  const pagesByMonth = new Map<string, number>();
  for (const entry of entries) {
    const month = entry.date.slice(0, 7);
    pagesByMonth.set(month, (pagesByMonth.get(month) ?? 0) + 1);
  }
  for (const [month, pages] of pagesByMonth) {
    if (pages >= MONTHLY_GOAL && !state.earnedMonths.includes(month)) state.earnedMonths.push(month);
  }

  const currentMonth = today.slice(0, 7);
  const months = new Set([currentMonth, ...state.earnedMonths]);
  const monthly: MonthlyBadgeDto[] = [...months]
    .sort((a, b) => b.localeCompare(a))
    .map((month) => ({
      month,
      pages: pagesByMonth.get(month) ?? 0,
      goal: MONTHLY_GOAL,
      earned: state.earnedMonths.includes(month),
    }));

  writeState(state);
  return {
    stats: { currentStreak: streak.current, longestStreak: streak.longest, totalPages: entries.length },
    achievements,
    monthly,
  };
}

export async function markAchievementSeen(id: string): Promise<void> {
  if (!currentOwner) throw new ApiError(409, "Your badges are still loading. Please try again.");
  const state = readState(currentOwner);
  state.seen[id] = state.levels[id] ?? 0;
  writeState(state);
}
