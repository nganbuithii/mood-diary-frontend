"use client";

import { useState } from "react";
import { cn } from "cn";

import { ErrorState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { AchievementDialog } from "@/components/achievements/achievement-dialog";
import { ACHIEVEMENT_META } from "@/components/achievements/achievement.constants";
import { MonthBadge } from "@/components/achievements/month-badge";
import {
  badgeNumber,
  isKnownAchievement,
  isNewAchievement,
} from "@/features/achievements/constants/achievement.constants";
import { useAchievements, useMarkAchievementSeen } from "@/features/achievements/hooks/use-achievements";
import type { KnownAchievementDto } from "@/features/achievements/types/achievement.types";

export function AchievementsView() {
  const { data, isPending, isError, refetch } = useAchievements();
  const { mutate: markSeen } = useMarkAchievementSeen();
  const [openId, setOpenId] = useState<string | null>(null);

  const achievements = (data?.achievements ?? []).filter(isKnownAchievement);
  const opened = achievements.find((item) => item.id === openId) ?? null;

  const open = (achievement: KnownAchievementDto) => {
    setOpenId(achievement.id);
    if (isNewAchievement(achievement)) markSeen(achievement.id);
  };

  return (
    <PageShell width="medium" glows={["bg-secondary/20", "bg-primary/15"]}>
      <PageHeader
        title={
          <>
            <span aria-hidden>♡</span> Achievements
          </>
        }
        description="Little badges for little habits. They never go away, so there's no rush ♡"
      />

      {isError && !data ? (
        <ErrorState message="Couldn't load your badges. Please try again." onRetry={() => refetch()} />
      ) : isPending || !data ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <Section title="Overview">
            <div className="grid grid-cols-2 gap-3">
              <Stat icon="🔥" value={data.stats.currentStreak} label="Day streak" highlight={data.stats.currentStreak > 0} />
              <Stat icon="📖" value={data.stats.totalPages} label="Pages written" />
              <Stat icon="🏅" value={data.stats.longestStreak} label="Best streak" />
              <Stat
                icon="🏆"
                value={achievements.filter((item) => item.level > 0).length + data.monthly.filter((item) => item.earned).length}
                label="Badges earned"
              />
            </div>
          </Section>

          <Section title="Monthly badges" description="Write 10 pages in a month to keep its badge">
            <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 sm:mx-0 sm:px-0">
              {data.monthly.map((badge) => (
                <MonthBadge key={badge.month} badge={badge} />
              ))}
            </ul>
          </Section>

          <Section title="Achievements">
            <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4">
              {achievements.map((achievement) => {
                const meta = ACHIEVEMENT_META[achievement.id];
                const isLocked = achievement.level === 0;
                const isNew = isNewAchievement(achievement);
                return (
                  <li key={achievement.id}>
                    <button
                      type="button"
                      onClick={() => open(achievement)}
                      aria-label={`${meta.name}, ${isLocked ? "not earned yet" : `level ${achievement.level}`}${isNew ? ", new" : ""}`}
                      className="group flex w-full flex-col items-center gap-2 rounded-2xl p-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <span className="relative block w-full max-w-28">
                        <AchievementBadge
                          image={meta.image}
                          toneClass={meta.toneClass}
                          number={badgeNumber(achievement)}
                          isLocked={isLocked}
                          className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:-rotate-2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0"
                        />
                        {isNew && (
                          <span
                            aria-hidden
                            className="absolute -top-1 -right-1 rotate-6 rounded-md bg-primary-hover px-1.5 py-0.5 text-[0.65rem] font-black tracking-wide text-primary-foreground uppercase shadow-sm"
                          >
                            New
                          </span>
                        )}
                      </span>
                      <span aria-hidden className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{meta.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {isLocked ? "Not yet" : `Level ${achievement.level}`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>
      )}

      <AchievementDialog achievement={opened} onClose={() => setOpenId(null)} />
    </PageShell>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-extrabold tracking-[0.12em] text-muted-foreground uppercase">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Stat({ icon, value, label, highlight = false }: { icon: string; value: number; label: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-4 py-3.5 shadow-[0_2px_0_var(--color-border)]",
        highlight && "border-primary-hover/40",
      )}
    >
      <span aria-hidden className="text-2xl leading-none">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xl leading-tight font-extrabold text-foreground">{value}</span>
        <span className="truncate text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
