"use client";

import { useState, type FormEvent } from "react";
import { cn } from "cn";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import { DiaryPhotoPicker, useDiaryPhotos } from "@/components/mood-diary/diary-photo-picker";
import { SongPicker } from "@/components/mood-diary/song-picker";
import type { Mood } from "@/components/mood-diary/mood.constants";
import { formatDateKey, formatMonthKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import { useDiaryEntries } from "@/features/diary/hooks/use-diary-entries";
import { useUpsertDiaryEntry } from "@/features/diary/hooks/use-upsert-diary-entry";
import type { Song } from "@/features/songs/types/song.types";
import { ApiError } from "@/lib/api/http-error";

export function MoodCheckinCard() {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const { data: entries, isPending } = useDiaryEntries(formatMonthKey(today));
  const todayEntry = entries?.find((entry) => entry.date === todayKey);

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
            Dear diary,
          </h1>
          <p className="text-sm text-muted-foreground">
            today I&apos;m feeling...
          </p>
        </div>

        {isPending ? (
          <Spinner className="my-10" />
        ) : (
          // Remount after each save so the form resets to what the server now has.
          <CheckinForm
            key={todayEntry?.updatedAt ?? "new"}
            date={todayKey}
            existingEntry={todayEntry}
          />
        )}
      </div>
    </RetroWindow>
  );
}

interface CheckinFormProps {
  date: string;
  existingEntry?: DiaryEntryDto;
}

function CheckinForm({ date, existingEntry }: CheckinFormProps) {
  const [mood, setMood] = useState<Mood | null>(existingEntry?.mood ?? null);
  const [note, setNote] = useState(existingEntry?.note ?? "");
  const [song, setSong] = useState<Song | null>(existingEntry?.song ?? null);
  const { photos, addFiles, removePhoto } = useDiaryPhotos();
  const savedPhotoUrls = existingEntry?.photoUrls ?? [];
  const [isPhotoOpen, setIsPhotoOpen] = useState(savedPhotoUrls.length > 0);
  const [isMusicOpen, setIsMusicOpen] = useState(song !== null);
  const upsertEntryMutation = useUpsertDiaryEntry();
  const isSaving = upsertEntryMutation.isPending;

  const isSongChanged = song?.id !== existingEntry?.song?.id;
  const isDirty =
    mood !== (existingEntry?.mood ?? null) ||
    note.trim() !== (existingEntry?.note ?? "").trim() ||
    photos.length > 0 ||
    isSongChanged;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!mood || !isDirty || isSaving) return;

    upsertEntryMutation.mutate(
      {
        date,
        mood,
        note: note.trim() || undefined,
        photos: photos.map((photo) => photo.file),
        songId: isSongChanged ? (song?.id ?? "") : undefined,
      },
      {
        onSuccess: () => toast.success("Saved your day ♡"),
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

  const actions = [
    { label: "Photo", emoji: "📷", isOpen: isPhotoOpen, toggle: () => setIsPhotoOpen((open) => !open) },
    { label: "Music", emoji: "🎵", isOpen: isMusicOpen, toggle: () => setIsMusicOpen((open) => !open) },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
      <MoodSelector value={mood} onChange={(value) => !isSaving && setMood(value)} />

      <Field className="text-left">
        <FieldLabel htmlFor="note" className="font-heading text-base">
          What&apos;s on your mind today? <span aria-hidden>♡</span>
        </FieldLabel>
        <Textarea
          id="note"
          placeholder="Tell me about your day..."
          value={note}
          disabled={isSaving}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={action.isOpen}
            onClick={action.toggle}
            className={cn(
              "gap-1.5 rounded-full",
              action.isOpen && "border-primary/60 bg-primary/10",
            )}
          >
            <span aria-hidden>{action.emoji}</span>
            {action.label}
          </Button>
        ))}
      </div>

      {isPhotoOpen && (
        <Field className="text-left">
          <FieldLabel>Add a few photos</FieldLabel>
          <DiaryPhotoPicker
            photos={photos}
            savedPhotoUrls={savedPhotoUrls}
            disabled={isSaving}
            onAddFiles={addFiles}
            onRemove={removePhoto}
          />
        </Field>
      )}

      {isMusicOpen && (
        <Field className="text-left">
          <FieldLabel>Song of the day</FieldLabel>
          <SongPicker value={song} onChange={setSong} disabled={isSaving} />
        </Field>
      )}

      <div className="flex flex-col items-center gap-2">
        <Button
          type="submit"
          size="lg"
          disabled={!mood || !isDirty || isSaving}
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
        {existingEntry && (
          <p className="text-xs text-muted-foreground">
            You&apos;ve already written today — saving will update it <span aria-hidden>♡</span>
          </p>
        )}
      </div>
    </form>
  );
}
