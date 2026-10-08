"use client";

import { use, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { AddDiaryDialog } from "@/components/calendar/add-diary-dialog";
import type { DiaryEntryValues } from "@/components/mood-diary/diary-entry-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  canOpenDay,
  formatDateKey,
  formatMonthKey,
  getMonthGrid,
  isAfterDay,
  parseDateKey,
} from "@/lib/date";
import { useDeleteDiaryEntry } from "@/features/diary/hooks/use-delete-diary-entry";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useUpsertDiaryEntry } from "@/features/diary/hooks/use-upsert-diary-entry";
import { ApiError } from "@/lib/api/http-error";
import { useToday } from "@/lib/hooks/use-today";

function parseDateParam(value: string | string[] | undefined, today: Date): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = parseDateKey(value);
  if (formatDateKey(date) !== value || isAfterDay(date, today)) return null;
  return date;
}

export default function DiaryCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const today = useToday();
  const initialDate = parseDateParam(use(searchParams).date, today);
  const [viewDate, setViewDate] = useState(() => {
    const monthOf = initialDate ?? today;
    return new Date(monthOf.getFullYear(), monthOf.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  const monthKey = formatMonthKey(viewDate);
  const {
    data: entryList,
    isError,
    isFetching,
    refetch,
  } = useDiaryEntries(monthKey);
  const upsertEntryMutation = useUpsertDiaryEntry();
  const deleteEntryMutation = useDeleteDiaryEntry();

  const entries = useMemo(
    () => Object.fromEntries((entryList ?? []).map((entry) => [entry.date, entry])),
    [entryList],
  );

  const selectedEntry = selectedDate ? entries[formatDateKey(selectedDate)] : undefined;
  const openDate =
    entryList && selectedDate && canOpenDay(selectedDate, today, Boolean(selectedEntry))
      ? selectedDate
      : null;

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

  const handleSaveEntry = (values: DiaryEntryValues) => {
    if (!openDate) return;

    upsertEntryMutation.mutate(
      { date: formatDateKey(openDate), ...values },
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

  const handleDeleteEntry = () => {
    if (!openDate) return;

    deleteEntryMutation.mutate(formatDateKey(openDate), {
      onSuccess: () => {
        setSelectedDate(null);
        toast.success("Deleted that day from your diary");
      },
      onError: (error) => {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Couldn't delete this day. Please try again.",
        );
      },
    });
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
              onSelectDay={(date) =>
                canOpenDay(date, today, Boolean(entries[formatDateKey(date)])) && setSelectedDate(date)
              }
            />
            {isFetching && !entryList && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-surface/60">
                <Spinner />
              </div>
            )}
          </div>
        )}

        <AddDiaryDialog
          date={openDate}
          existingEntry={selectedEntry}
          isSaving={upsertEntryMutation.isPending}
          isDeleting={deleteEntryMutation.isPending}
          onOpenChange={(open) => !open && setSelectedDate(null)}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />
      </main>
    </div>
  );
}
