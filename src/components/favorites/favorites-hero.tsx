import { cn } from "cn";

import { MoodAvatar } from "@/components/mood-diary/mood-avatar";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";

export interface FavoritesStats {
  /** Number of favorites loaded so far. */
  count: number;
  /** True while more pages exist, so `count` is a lower bound. */
  hasMore: boolean;
  songCount: number;
  /** Only known once every favorite is loaded; a partial count could name the wrong mood. */
  topMood?: Mood;
}

export function FavoritesHero({ stats }: { stats?: FavoritesStats }) {
  return (
    <header className="relative isolate overflow-hidden rounded-[2rem] bg-linear-to-br from-primary/35 via-mood-very-happy/35 to-accent-blue/35 px-6 py-8 shadow-sm ring-1 ring-foreground/5 sm:px-10 sm:py-10">
      <Stickers />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="w-fit rotate-[-3deg] rounded-full bg-surface/80 px-3 py-0.5 font-heading text-sm text-primary-hover shadow-sm">
            ♡ your treasure box
          </span>
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Little treasures</h1>
          <p className="max-w-sm text-sm text-foreground/75">
            The days you wanted to keep forever, all tucked in one cozy box.
          </p>
        </div>

        {stats && stats.count > 0 && (
          <dl className="flex flex-wrap gap-2 sm:justify-end">
            <StatBubble label="treasures" value={`${stats.count}${stats.hasMore ? "+" : ""}`} tilt="left" />
            <StatBubble label="songs" value={String(stats.songCount)} tilt="right" />
            {stats.topMood && (
              <div className="flex items-center gap-2 rounded-2xl bg-surface/85 px-3 py-2 shadow-sm backdrop-blur-sm">
                <MoodAvatar mood={stats.topMood} className="size-9 p-0.5" />
                <div className="flex flex-col leading-tight">
                  <dt className="text-xs text-muted-foreground">top vibe</dt>
                  <dd className="font-heading text-base text-foreground">{MOOD_META[stats.topMood].label}</dd>
                </div>
              </div>
            )}
          </dl>
        )}
      </div>
    </header>
  );
}

function StatBubble({ label, value, tilt }: { label: string; value: string; tilt: "left" | "right" }) {
  return (
    <div
      className={cn(
        // Column-reversed so the term comes first in the markup but the number reads on top.
        "flex min-w-20 flex-col-reverse items-center rounded-2xl bg-surface/85 px-4 py-2 shadow-sm backdrop-blur-sm",
        tilt === "left" ? "-rotate-2" : "rotate-2",
      )}
    >
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-heading text-2xl text-foreground tabular-nums">{value}</dd>
    </div>
  );
}

function Stickers() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 font-heading">
      <span className="absolute -top-6 -right-6 size-32 rounded-full bg-surface/30 blur-2xl" />
      <span className="absolute -bottom-10 left-1/3 size-40 rounded-full bg-primary/30 blur-3xl" />
      <span className="absolute top-5 right-[38%] rotate-12 text-3xl text-primary-hover/40">♡</span>
      <span className="absolute right-6 bottom-6 -rotate-12 text-2xl text-white/90 sm:right-[45%]">✦</span>
      <span className="absolute top-1/2 right-10 hidden rotate-6 text-4xl text-white/70 sm:block">♡</span>
      <span className="absolute bottom-3 left-[55%] text-lg text-primary-hover/40">✿</span>
    </div>
  );
}
