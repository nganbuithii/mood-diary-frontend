"use client";

import { Check } from "lucide-react";
import { cn } from "cn";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { AchievementBadge } from "@/components/achievements/achievement-badge";
import { ACHIEVEMENT_META } from "@/components/achievements/achievement.constants";
import { badgeNumber, nextTier } from "@/features/achievements/constants/achievement.constants";
import type { KnownAchievementDto } from "@/features/achievements/types/achievement.types";
import { pluralize } from "@/lib/utils";

interface AchievementDialogProps {
  achievement: KnownAchievementDto | null;
  onClose: () => void;
}

export function AchievementDialog({ achievement, onClose }: AchievementDialogProps) {
  return (
    <Dialog open={achievement !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm rounded-[2rem] px-6 pt-8 pb-6 sm:max-w-sm">
        {achievement && <AchievementDetail achievement={achievement} />}
      </DialogContent>
    </Dialog>
  );
}

function AchievementDetail({ achievement }: { achievement: KnownAchievementDto }) {
  const meta = ACHIEVEMENT_META[achievement.id];
  const { level, value, tiers } = achievement;
  const next = nextTier(achievement);
  const isLocked = level === 0;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <AchievementBadge
        image={meta.image}
        toneClass={meta.toneClass}
        number={badgeNumber(achievement)}
        isLocked={isLocked}
        className="w-32"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-extrabold tracking-[0.12em] text-muted-foreground uppercase">
          {isLocked ? "Not yet" : `Level ${level} of ${tiers.length}`}
        </span>
        <DialogTitle className="text-2xl">{meta.name}</DialogTitle>
        <DialogDescription>
          {isLocked ? meta.goal(tiers[0]) : meta.done(badgeNumber(achievement))} <span aria-hidden>♡</span>
        </DialogDescription>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-2xl bg-background/70 p-4 text-left">
        {next === null ? (
          <p className="text-center text-sm font-semibold text-foreground">You&apos;ve reached the top level ✦</p>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold text-foreground">{isLocked ? "First badge" : `Level ${level + 1}`}</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {Math.min(value, next)} / {pluralize(next, meta.unit)}
              </span>
            </div>
            <Progress value={value / next} label={`${value} of ${pluralize(next, meta.unit)}`} />
            <p className="text-xs text-muted-foreground">{meta.goal(next)}. No rush ♡</p>
          </>
        )}
      </div>

      <ol aria-label="Levels" className="flex flex-wrap justify-center gap-1.5">
        {tiers.map((tier, index) => {
          const isReached = index < level;
          return (
            <li
              key={tier}
              className={cn(
                "flex h-7 min-w-9 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-bold",
                isReached ? "bg-primary/20 text-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {isReached && <Check aria-hidden className="size-3" strokeWidth={3} />}
              {tier}
              <span className="sr-only">{isReached ? ", reached" : ", not yet"}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
