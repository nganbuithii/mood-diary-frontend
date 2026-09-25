"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { AddDiaryDialog } from "@/components/calendar/add-diary-dialog";
import { formatDateKey, getMonthGrid } from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";
import type { Mood } from "@/components/mood-diary/mood.constants";

const today = new Date();

const DEMO_ENTRIES: { dayOffset: number; mood: Mood; note?: string }[] = [
  { dayOffset: -11, mood: "HAPPY", note: "Coffee with an old friend, felt so nice." },
  { dayOffset: -7, mood: "VERY_HAPPY", note: "Finished my side project demo!" },
  { dayOffset: -3, mood: "NEUTRAL", note: "Quiet day, lots of rain." },
  { dayOffset: -1, mood: "SAD", note: "Missed the bus twice, rough morning." },
];

function buildDemoEntries(): Record<string, DiaryEntry> {
  const entries: Record<string, DiaryEntry> = {};
  for (const item of DEMO_ENTRIES) {
    const date = new Date(today);
    date.setDate(date.getDate() + item.dayOffset);
    const key = formatDateKey(date);
    entries[key] = { date: key, mood: item.mood, note: item.note };
  }
  return entries;
}

export default function DiaryCalendarPage() {
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>(buildDemoEntries);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const handleSaveEntry = (mood: Mood, note: string) => {
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    setEntries((current) => ({
      ...current,
      [key]: { date: key, mood, note: note.trim() || undefined },
    }));
    setSelectedDate(null);
    toast.success("Saved your day ♡");
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

        <MonthGrid
          days={days}
          currentMonth={viewDate.getMonth()}
          today={today}
          entries={entries}
          onSelectDay={setSelectedDate}
        />

        <AddDiaryDialog
          date={selectedDate}
          existingEntry={selectedDate ? entries[formatDateKey(selectedDate)] : undefined}
          onOpenChange={(open) => !open && setSelectedDate(null)}
          onSave={handleSaveEntry}
        />
      </main>
    </div>
  );
}
