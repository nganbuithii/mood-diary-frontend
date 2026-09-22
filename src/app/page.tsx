"use client";

import { Navbar } from "@/components/layout/navbar";
import { MoodCheckinCard } from "@/components/mood-diary/mood-checkin-card";
import { RecentMemoriesSection } from "@/components/mood-diary/recent-memories-section";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { data: currentUser } = useCurrentUser();
  const greeting = getGreeting(new Date().getHours());

  return (
    <div className="min-h-svh bg-background">
      <Navbar />

      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-accent-blue/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-secondary/15 blur-3xl"
        />

        <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
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

          <MoodCheckinCard />

          <RecentMemoriesSection />
        </main>
      </div>
    </div>
  );
}
