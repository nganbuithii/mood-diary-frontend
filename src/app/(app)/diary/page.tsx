"use client";

import { use, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { AddDiaryDialog } from "@/components/calendar/add-diary-dialog";
import type { DiaryEntryValues } from "@/components/mood-diary/diary-entry-fields";
import { ErrorState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { PageShell } from "@/components/layout/page-shell";
import {
  canOpenDay,
  formatDate,
  formatDateKey,
  formatMonthKey,
  getMonthGrid,
  isAfterDay,
  startOfMonth,
  tryParseDateKey,
} from "@/lib/date";
import { useDeleteDiaryEntry } from "@/features/diary/hooks/use-delete-diary-entry";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useUpsertDiaryEntry } from "@/features/diary/hooks/use-upsert-diary-entry";
import { getErrorMessage } from "@/lib/api/http-error";
import { useToday } from "@/lib/hooks/use-today";

function parseDateParam(value: string | string[] | undefined, today: Date): Date | null {
  const date = tryParseDateKey(value);
  return date && !isAfterDay(date, today) ? date : null;
}

export default function DiaryCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const today = useToday();
  const initialDate = parseDateParam(use(searchParams).date, today);
  const [viewDate, setViewDate] = useState(() => startOfMonth(initialDate ?? today));
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
  const monthLabel = formatDate(viewDate, "monthYear");

  const goToPrevMonth = () => setViewDate((current) => startOfMonth(current, -1));
  const goToNextMonth = () => setViewDate((current) => startOfMonth(current, 1));
  const goToToday = () => setViewDate(startOfMonth(today));

  const handleSaveEntry = (values: DiaryEntryValues) => {
    if (!openDate) return;

    upsertEntryMutation.mutate(
      { date: formatDateKey(openDate), ...values },
      {
        onSuccess: () => {
          setSelectedDate(null);
          toast.success("Saved your day ♡");
        },
        onError: (error) => toast.error(getErrorMessage(error, "Couldn't save your day. Please try again.")),
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
      onError: (error) => toast.error(getErrorMessage(error, "Couldn't delete this day. Please try again.")),
    });
  };

  return (
    <PageShell glows={["bg-accent-blue/20", "bg-secondary/15"]} className="gap-6">
      <CalendarHeader
        label={monthLabel}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
      />

      {isError ? (
        <ErrorState message="Couldn't load your diary. Please try again." onRetry={() => refetch()} />
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
    </PageShell>
  );
}
