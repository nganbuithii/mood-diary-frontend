"use client";

import { PageShell } from "@/components/layout/page-shell";
import { LetterboxCard } from "@/components/letters/letterbox-card";
import { LittleMemoryCard } from "@/components/mood-diary/little-memory-card";
import { MoodCheckinCard } from "@/components/mood-diary/mood-checkin-card";
import { MoodStreakCard } from "@/components/mood-diary/mood-streak-card";
import { RecentMemoriesSection } from "@/components/mood-diary/recent-memories-section";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeView() {
  const { data: currentUser } = useCurrentUser();
  const greeting = getGreeting(new Date().getHours());

  return (
    <PageShell glows={["bg-accent-blue/20", "bg-secondary/15"]} className="gap-10 py-10">
      <section className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
          {greeting}
          {currentUser ? `, ${currentUser.displayName}` : ""}{" "}
          <span aria-hidden>♡</span>
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Every feeling deserves a little space.
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <MoodCheckinCard />

        <aside className="flex flex-col gap-6 lg:gap-8">
          <MoodStreakCard />
          <LittleMemoryCard />
          <LetterboxCard />
        </aside>
      </div>

      <RecentMemoriesSection />
    </PageShell>
  );
}
