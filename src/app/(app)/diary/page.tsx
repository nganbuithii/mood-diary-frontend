"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { AddDiaryDialog, type DiaryFormValues } from "@/components/calendar/add-diary-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  formatDateKey,
  formatMonthKey,
  getMonthGrid,
} from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useUpsertDiaryEntry } from "@/features/diary/hooks/use-upsert-diary-entry";
import { ApiError } from "@/lib/api/http-error";

const today = new Date();

export default function DiaryCalendarPage() {
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthKey = formatMonthKey(viewDate);
  const {
    data: entryList,
    isError,
    isFetching,
    refetch,
  } = useDiaryEntries(monthKey);
  const upsertEntryMutation = useUpsertDiaryEntry();

  const entries = useMemo<Record<string, DiaryEntry>>(() => {
    const map: Record<string, DiaryEntry> = {};
    for (const entry of entryList ?? []) {
      map[entry.date] = {
        date: entry.date,
        mood: entry.mood,
        note: entry.note ?? undefined,
        photoUrls: entry.photoUrls,
        song: entry.song,
      };
    }
    return map;
  }, [entryList]);

  const days = getMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPrevMonth = () =>
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const handleSaveEntry = ({ mood, note, photos, songId }: DiaryFormValues) => {
    if (!selectedDate) return;
    const date = formatDateKey(selectedDate);

    upsertEntryMutation.mutate(
      { date, mood, note: note.trim() || undefined, photos, songId },
      {
        onSuccess: () => {
          setSelectedDate(null);
          toast.success("Saved your day ♡");
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError
              ? error.message
              : "Couldn't save your day. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-accent-blue/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-secondary/15 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
        <CalendarHeader
          label={monthLabel}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
        />

        {isError ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load your diary. Please try again.
            </p>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="relative">
            <MonthGrid
              days={days}
              currentMonth={viewDate.getMonth()}
              today={today}
              entries={entries}
              onSelectDay={setSelectedDate}
            />
            {isFetching && !entryList && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-surface/60">
                <Spinner />
              </div>
            )}
          </div>
        )}

        <AddDiaryDialog
          date={selectedDate}
          existingEntry={selectedDate ? entries[formatDateKey(selectedDate)] : undefined}
          isSaving={upsertEntryMutation.isPending}
          onOpenChange={(open) => !open && setSelectedDate(null)}
          onSave={handleSaveEntry}
        />
      </main>
    </div>
  );
}
