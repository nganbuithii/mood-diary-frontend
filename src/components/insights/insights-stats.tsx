import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "cn";

import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { MoodStatsDto } from "@/features/diary/api/mood-stats.types";
import type { MoodStreakDto } from "@/features/diary/api/mood-streak.types";

interface InsightsStatsProps {
  stats: MoodStatsDto;
  elapsedDays: number;
  previousMonthLabel: string;
  streak?: MoodStreakDto;
}

export function InsightsStats({ stats, elapsedDays, previousMonthLabel, streak }: InsightsStatsProps) {
  const top = stats.topMood ? MOOD_META[stats.topMood] : null;

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile label="Pages written" tilt="left">
        <dd className="font-heading text-3xl text-foreground tabular-nums">
          {stats.writtenDays}
          <span className="text-base text-muted-foreground"> / {elapsedDays}</span>
        </dd>
        <dd className="text-xs text-muted-foreground">
          {stats.writtenDays === elapsedDays && elapsedDays > 0 ? "Every single day ✦" : "days so far"}
        </dd>
      </Tile>

      <Tile label="Top vibe" tilt="right">
        {top ? (
          <dd className="flex items-center gap-2">
            <span aria-hidden className={cn("size-9 shrink-0 rounded-full p-0.5", top.bgClass)}>
              <MoodFace mood={top.value} />
            </span>
            <span className="font-heading text-2xl text-foreground">{top.label}</span>
          </dd>
        ) : (
          <dd className="font-heading text-2xl text-foreground">{stats.writtenDays > 0 ? "A mixed bag" : "—"}</dd>
        )}
        <dd className="text-xs text-muted-foreground">
          {top
            ? `${stats.moodCounts[top.value]} of ${stats.writtenDays} pages`
            : stats.writtenDays > 0
              ? "No single mood came out on top"
              : "Nothing written yet"}
        </dd>
      </Tile>

      <Tile label="Mood score" tilt="left">
        <dd className="font-heading text-3xl text-foreground tabular-nums">
          {stats.averageScore === null ? "—" : stats.averageScore.toFixed(1)}
          <span className="text-base text-muted-foreground"> / 5</span>
        </dd>
        <dd className="text-xs text-muted-foreground">
          <ScoreTrend
            current={stats.averageScore}
            previous={stats.previous.averageScore}
            previousMonthLabel={previousMonthLabel}
          />
        </dd>
      </Tile>

      <Tile label="Current streak" tilt="right">
        <dd className="font-heading text-3xl text-foreground tabular-nums">
          {streak ? streak.current : "—"}
          <span className="text-base text-muted-foreground"> {streak?.current === 1 ? "day" : "days"}</span>
        </dd>
        <dd className="text-xs text-muted-foreground">
          {streak ? `Longest ever: ${streak.longest} ${streak.longest === 1 ? "day" : "days"}` : "Loading…"}
        </dd>
      </Tile>
    </dl>
  );
}

// The arrow and the words carry the direction, so it never relies on color.
function ScoreTrend({
  current,
  previous,
  previousMonthLabel,
}: {
  current: number | null;
  previous: number | null;
  previousMonthLabel: string;
}) {
  if (current === null) return <>Write a page to get a score</>;
  if (previous === null) return <>No {previousMonthLabel} pages to compare</>;

  const delta = Math.round((current - previous) * 10) / 10;
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1">
        <Minus aria-hidden className="size-3.5" /> Same as {previousMonthLabel}
      </span>
    );
  }

  const Icon = delta > 0 ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1">
      <Icon aria-hidden className="size-3.5" />
      {delta > 0 ? "Up" : "Down"} {Math.abs(delta).toFixed(1)} from {previousMonthLabel}
    </span>
  );
}

function Tile({ label, tilt, children }: { label: string; tilt: "left" | "right"; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-3xl bg-surface/90 px-4 py-3 shadow-sm ring-1 ring-foreground/5",
        tilt === "left" ? "sm:-rotate-1" : "sm:rotate-1",
      )}
    >
      <dt className="font-heading text-sm text-muted-foreground">{label}</dt>
      {children}
    </div>
  );
}
