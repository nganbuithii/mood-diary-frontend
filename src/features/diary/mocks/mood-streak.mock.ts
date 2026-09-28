import type { Mood } from "@/components/mood-diary/mood.constants";
import { formatDateKey } from "@/components/calendar/calendar.utils";
import type { MoodStreakDto } from "@/features/diary/api/mood-streak.types";

// TODO: remove once GET /mood-entries/streak is integrated.
const MOCK_WEEK_MOODS: (Mood | null)[] = [
  "HAPPY",
  "VERY_HAPPY",
  "NEUTRAL",
  "HAPPY",
  "SAD",
  "VERY_HAPPY",
  null,
];

export function buildMockMoodStreak(today = new Date()): MoodStreakDto {
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);

  const week = MOCK_WEEK_MOODS.map((mood, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const hasEntry = index <= mondayOffset && mood !== null;
    return { date: formatDateKey(date), mood: hasEntry ? mood : null, hasEntry };
  });

  const currentStreak = countCurrentStreak(week.slice(0, mondayOffset + 1));
  return { currentStreak, longestStreak: Math.max(currentStreak, 12), week };
}

// Today without an entry yet doesn't break the streak.
function countCurrentStreak(daysUntilToday: MoodStreakDto["week"]): number {
  const days = [...daysUntilToday].reverse();
  if (days[0] && !days[0].hasEntry) days.shift();

  let count = 0;
  for (const day of days) {
    if (!day.hasEntry) break;
    count += 1;
  }
  return count;
}
