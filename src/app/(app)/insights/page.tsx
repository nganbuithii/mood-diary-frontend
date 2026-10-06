"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InsightsStats } from "@/components/insights/insights-stats";
import { MoodBreakdown } from "@/components/insights/mood-breakdown";
import { MoodHeatmap } from "@/components/insights/mood-heatmap";
import { formatDateKey, formatMonthKey } from "@/lib/date";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useMoodStats } from "@/features/diary/hooks/use-mood-stats";
import { useMoodStreak } from "@/features/diary/hooks/use-mood-streak";
import { useToday } from "@/lib/hooks/use-today";

type SearchParams = Promise<{ month?: string | string[] }>;

function parseMonth(value: string | string[] | undefined, today: Date): Date {
  const current = new Date(today.getFullYear(), today.getMonth(), 1);
  if (typeof value !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return current;
  const [year, month] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, 1);
  return parsed > current ? current : parsed;
}

function monthLabel(date: Date, withYear = true) {
  return date.toLocaleDateString("en-US", withYear ? { month: "long", year: "numeric" } : { month: "long" });
}

export default function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const today = useToday();
  const month = parseMonth(use(searchParams).month, today);
  const monthKey = formatMonthKey(month);
  const isCurrentMonth = monthKey === formatMonthKey(today);
  const previousMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);

  const stats = useMoodStats(monthKey);
  const entries = useDiaryEntries(monthKey);
  const { data: streak } = useMoodStreak(formatDateKey(today));

  const goToMonth = (date: Date) => {
    const key = formatMonthKey(date);
    router.replace(key === formatMonthKey(today) ? "/insights" : `/insights?month=${key}`, { scroll: false });
  };

  const { data } = stats;
  const elapsedDays = isCurrentMonth ? today.getDate() : (data?.daysInMonth ?? 0);

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[-10%] size-72 rounded-full bg-mood-very-happy/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-0 size-72 rounded-full bg-accent-blue/20 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="w-fit -rotate-2 rounded-full bg-surface/80 px-3 py-0.5 font-heading text-sm text-primary-hover shadow-sm">
              ✦ your mood, looked back on
            </span>
            <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Insights</h1>
          </div>

          <nav aria-label="Choose month" className="flex items-center gap-1 self-start rounded-full bg-surface/90 p-1 shadow-sm ring-1 ring-foreground/5 sm:self-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label={`Previous month, ${monthLabel(previousMonth)}`}
              onClick={() => goToMonth(previousMonth)}
            >
              <ChevronLeft />
            </Button>
            <span aria-live="polite" className="min-w-36 text-center font-heading text-lg text-foreground">
              {monthLabel(month)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Next month"
              disabled={isCurrentMonth}
              onClick={() => goToMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              <ChevronRight />
            </Button>
          </nav>
        </header>

        {stats.isError && !data ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">Couldn&apos;t load your insights. Please try again.</p>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => stats.refetch()}>
              Retry
            </Button>
          </div>
        ) : !data ? (
          <InsightsSkeleton />
        ) : (
          <>
            <InsightsStats
              stats={data}
              elapsedDays={elapsedDays}
              previousMonthLabel={monthLabel(previousMonth, false)}
              streak={streak}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <Section title="Mood mix" subtitle={`How your ${monthLabel(month, false)} pages felt`}>
                <MoodBreakdown stats={data} monthLabel={monthLabel(month, false)} />
              </Section>

              <Section title="Month at a glance" subtitle="Tap a day to open it">
                {entries.data ? (
                  <MoodHeatmap month={month} entries={entries.data} today={today} />
                ) : entries.isError ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Couldn&apos;t load this month&apos;s days.</p>
                ) : (
                  <div aria-hidden className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 35 }, (_, index) => (
                      <span key={index} className="aspect-square animate-pulse rounded-[6px] bg-muted" />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-[2rem] bg-surface/90 p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function InsightsSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="h-64 animate-pulse rounded-[2rem] bg-muted" />
        <div className="h-64 animate-pulse rounded-[2rem] bg-muted" />
      </div>
    </div>
  );
}
