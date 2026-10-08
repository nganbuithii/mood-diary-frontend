"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Music2 } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { MoodFace } from "@/components/mood-diary/mood-face";
import { DiaryEntryFields, useDiaryEntryForm } from "@/components/mood-diary/diary-entry-fields";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import { formatDateKey, formatMonthKey } from "@/lib/date";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useUpsertDiaryEntry } from "@/features/diary/hooks/use-upsert-diary-entry";
import { ApiError } from "@/lib/api/http-error";
import { useToday } from "@/lib/hooks/use-today";

export function MoodCheckinCard() {
  const today = useToday();
  const todayKey = formatDateKey(today);
  const { data: entries, isPending, isError, refetch } = useDiaryEntries(formatMonthKey(today));
  const todayEntry = entries?.find((entry) => entry.date === todayKey);
  const [isEditing, setIsEditing] = useState(false);
  const isViewing = todayEntry !== undefined && !isEditing;

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <RetroWindow title="Dear Diary" accent className="w-full">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            ୨୧ {formattedDate} ୨୧
          </span>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
            {isViewing ? (
              <>
                Today&apos;s diary <span aria-hidden>♡</span>
              </>
            ) : (
              "Dear diary,"
            )}
          </h1>
          {!isViewing && (
            <p className="text-sm text-muted-foreground">
              today I&apos;m feeling...
            </p>
          )}
        </div>

        {isPending ? (
          <Spinner className="my-10" />
        ) : isError && !entries ? (
          <ErrorState
            message="Couldn't load today's diary. Please try again."
            onRetry={() => refetch()}
            className="w-full py-10"
          />
        ) : isViewing ? (
          <TodayEntryView entry={todayEntry} onEdit={() => setIsEditing(true)} />
        ) : (
          <CheckinForm
            date={todayKey}
            existingEntry={todayEntry}
            onSaved={() => setIsEditing(false)}
            onCancel={todayEntry ? () => setIsEditing(false) : undefined}
          />
        )}
      </div>
    </RetroWindow>
  );
}

interface TodayEntryViewProps {
  entry: DiaryEntryDto;
  onEdit: () => void;
}

function TodayEntryView({ entry, onEdit }: TodayEntryViewProps) {
  const meta = MOOD_META[entry.mood];
  const photoCount = entry.photoUrls.length;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <span className={cn("size-24 -rotate-3 rounded-full p-1.5 shadow-sm sm:size-28", meta.bgClass)}>
          <MoodFace mood={meta.value} />
        </span>
        <span className="font-heading text-xl text-foreground">{meta.label}</span>
      </div>

      <div className="relative w-full rotate-[0.5deg] rounded-md border border-dashed border-border bg-surface px-5 pt-6 pb-5 text-left shadow-sm">
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 h-3 w-14 -translate-x-1/2 -rotate-2 rounded-[2px] bg-secondary/50"
        />
        {entry.note ? (
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90 sm:text-base">
            {entry.note}
          </p>
        ) : (
          <p className="text-center text-sm text-muted-foreground italic">
            No words today — just a feeling <span aria-hidden>♡</span>
          </p>
        )}
      </div>

      {(photoCount > 0 || entry.song) && (
        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
          {photoCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-muted/60 py-1 pr-3 pl-1">
              <span className="flex -space-x-2">
                {entry.photoUrls.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt=""
                    className="size-6 rounded-full border-2 border-surface object-cover"
                  />
                ))}
              </span>
              <span className="text-xs text-foreground">
                {photoCount} photo{photoCount === 1 ? "" : "s"}
              </span>
            </span>
          )}
          {entry.song && (
            <span className="flex min-w-0 max-w-full items-center gap-2 rounded-full bg-muted/60 py-1 pr-3 pl-1">
              <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-blue/30 text-foreground">
                {entry.song.artworkUrl ? (
                  <img src={entry.song.artworkUrl} alt="" className="size-full object-cover" />
                ) : (
                  <Music2 className="size-3" />
                )}
              </span>
              <span className="min-w-0 truncate text-xs">
                <span className="font-medium text-foreground">{entry.song.title}</span>
                <span className="text-muted-foreground"> · {entry.song.artist}</span>
              </span>
            </span>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        <span aria-hidden>♡</span> Your day is safely tucked away <span aria-hidden>♡</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="outline" size="lg" className="rounded-full px-6" onClick={onEdit}>
          Edit <span aria-hidden>♡</span>
        </Button>
        <Button
          size="lg"
          className="rounded-full px-6"
          render={
            <Link href="/diary">
              View diary <span aria-hidden>→</span>
            </Link>
          }
        />
      </div>
    </div>
  );
}

interface CheckinFormProps {
  date: string;
  existingEntry?: DiaryEntryDto;
  onSaved: () => void;
  onCancel?: () => void;
}

function CheckinForm({ date, existingEntry, onSaved, onCancel }: CheckinFormProps) {
  const form = useDiaryEntryForm(existingEntry);
  const upsertEntryMutation = useUpsertDiaryEntry();
  const isSaving = upsertEntryMutation.isPending;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.values || isSaving) return;

    upsertEntryMutation.mutate(
      { date, ...form.values },
      {
        onSuccess: () => {
          toast.success("Saved your day ♡");
          onSaved();
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
      <DiaryEntryFields
        form={form}
        disabled={isSaving}
        noteId="note"
        noteLabel={
          <>
            What&apos;s on your mind today? <span aria-hidden>♡</span>
          </>
        }
        notePlaceholder="Tell me about your day..."
        noteLabelClassName="font-heading text-base"
        collapsibleExtras
      />

      <div className="flex flex-col items-center gap-2">
        <Button
          type="submit"
          size="lg"
          disabled={!form.values || isSaving}
          className="w-full sm:w-auto sm:px-8"
        >
          {isSaving ? (
            <Spinner size="sm" className="border-primary-foreground border-t-transparent" />
          ) : (
            <>
              {existingEntry ? "Update my day" : "Save my day"} <span aria-hidden>♡</span>
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={onCancel}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
