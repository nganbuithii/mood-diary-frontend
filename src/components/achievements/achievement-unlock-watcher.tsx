"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ACHIEVEMENT_META } from "@/components/achievements/achievement.constants";
import { isKnownAchievement } from "@/features/achievements/constants/achievement.constants";
import { useAchievements } from "@/features/achievements/hooks/use-achievements";
import { formatDate, tryParseMonthKey } from "@/lib/date";

// Only badges earned during this visit get a toast; ones already waiting on load just show the navbar dot.
export function AchievementUnlockWatcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useAchievements();
  const previous = useRef<{ levels: Map<string, number>; months: Set<string> } | null>(null);

  useEffect(() => {
    if (!data) return;
    const achievements = data.achievements.filter(isKnownAchievement);
    const levels = new Map(achievements.map((item) => [item.id, item.level]));
    const months = new Set(data.monthly.filter((item) => item.earned).map((item) => item.month));
    const before = previous.current;
    previous.current = { levels, months };
    if (!before || pathname === "/achievements") return;

    const messages = [
      ...achievements
        .filter((item) => item.level > (before.levels.get(item.id) ?? 0))
        .map((item) => `${ACHIEVEMENT_META[item.id].name} · Level ${item.level}`),
      ...[...months]
        .filter((month) => !before.months.has(month))
        .map((month) => {
          const date = tryParseMonthKey(month);
          return `${date ? formatDate(date, "month") : month} monthly badge`;
        }),
    ];
    if (messages.length === 0) return;

    toast(messages.length === 1 ? "New badge unlocked ✦" : `${messages.length} new badges unlocked ✦`, {
      icon: "🏆",
      description: messages.join(" · "),
      action: { label: "See it", onClick: () => router.push("/achievements") },
    });
  }, [data, pathname, router]);

  return null;
}
