"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/empty-state";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { InsightsStats } from "@/components/insights/insights-stats";
import { MoodBreakdown } from "@/components/insights/mood-breakdown";
import { MoodHeatmap } from "@/components/insights/mood-heatmap";
import { formatDate, formatDateKey, formatMonthKey, startOfMonth, tryParseMonthKey } from "@/lib/date";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useMoodStats } from "@/features/diary/hooks/use-mood-stats";
import { useMoodStreak } from "@/features/diary/hooks/use-mood-streak";
import { useToday } from "@/lib/hooks/use-today";

type SearchParams = Promise<{ month?: string | string[] }>;

function parseMonth(value: string | string[] | undefined, today: Date): Date {
  const current = startOfMonth(today);
  const parsed = tryParseMonthKey(value);
  return parsed && parsed <= current ? parsed : current;
}

export default function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const today = useToday();
  const month = parseMonth(use(searchParams).month, today);
  const monthKey = formatMonthKey(month);
  const isCurrentMonth = monthKey === formatMonthKey(today);
  const previousMonth = startOfMonth(month, -1);
  const monthName = formatDate(month, "month");

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
    <PageShell glows={["bg-mood-very-happy/25", "bg-accent-blue/20"]} className="gap-6">
      <PageHeader
        eyebrow="✦ your mood, looked back on"
        title="Insights"
        actions={
          <nav
            aria-label="Choose month"
            className="flex items-center gap-1 rounded-full bg-surface/90 p-1 shadow-sm ring-1 ring-foreground/5"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label={`Previous month, ${formatDate(previousMonth, "monthYear")}`}
              onClick={() => goToMonth(previousMonth)}
            >
              <ChevronLeft />
            </Button>
            <span aria-live="polite" className="min-w-36 text-center font-heading text-lg text-foreground">
              {formatDate(month, "monthYear")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              aria-label="Next month"
              disabled={isCurrentMonth}
              onClick={() => goToMonth(startOfMonth(month, 1))}
            >
              <ChevronRight />
            </Button>
          </nav>
        }
      />

      {stats.isError && !data ? (
        <ErrorState message="Couldn't load your insights. Please try again." onRetry={() => stats.refetch()} />
      ) : !data ? (
        <InsightsSkeleton />
      ) : (
        <>
          <InsightsStats
            stats={data}
            elapsedDays={elapsedDays}
            previousMonthLabel={formatDate(previousMonth, "month")}
            streak={streak}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Section title="Mood mix" subtitle={`How your ${monthName} pages felt`}>
              <MoodBreakdown stats={data} monthLabel={monthName} />
            </Section>

            <Section title="Month at a glance" subtitle="Tap a day to open it">
              {entries.data ? (
                <MoodHeatmap month={month} entries={entries.data} today={today} />
              ) : entries.isError ? (
                <ErrorState
                  message="Couldn't load this month's days."
                  onRetry={() => entries.refetch()}
                  className="py-8"
                />
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
    </PageShell>
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
