"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import {
  DiaryPhotoPicker,
  MAX_PHOTOS,
  useDiaryPhotos,
} from "@/components/mood-diary/diary-photo-picker";
import type { Mood } from "@/components/mood-diary/mood.constants";
import { SongPicker } from "@/components/mood-diary/song-picker";
import { formatDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";
import type { Song } from "@/features/songs/types/song.types";

export interface DiaryFormValues {
  mood: Mood;
  note: string;
  photos: File[];
  songId?: string;
}

interface AddDiaryDialogProps {
  date: Date | null;
  existingEntry?: DiaryEntry;
  isSaving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: DiaryFormValues) => void;
}

export function AddDiaryDialog({
  date,
  existingEntry,
  isSaving = false,
  onOpenChange,
  onSave,
}: AddDiaryDialogProps) {
  return (
    <Dialog open={date !== null} onOpenChange={(open) => !isSaving && onOpenChange(open)}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md"
      >
        {date && (
          <DiaryForm
            key={formatDateKey(date)}
            date={date}
            existingEntry={existingEntry}
            isSaving={isSaving}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface DiaryFormProps {
  date: Date;
  existingEntry?: DiaryEntry;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (values: DiaryFormValues) => void;
}

function DiaryForm({ date, existingEntry, isSaving, onCancel, onSave }: DiaryFormProps) {
  const [mood, setMood] = useState<Mood | null>(existingEntry?.mood ?? null);
  const [note, setNote] = useState(existingEntry?.note ?? "");
  const [song, setSong] = useState<Song | null>(existingEntry?.song ?? null);
  const { photos, addFiles, removePhoto } = useDiaryPhotos();

  const isSongChanged = song?.id !== existingEntry?.song?.id;
  const isDirty =
    mood !== (existingEntry?.mood ?? null) ||
    note.trim() !== (existingEntry?.note ?? "").trim() ||
    photos.length > 0 ||
    isSongChanged;

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!mood || !isDirty) return;

    onSave({
      mood,
      note,
      photos: photos.map((photo) => photo.file),
      songId: isSongChanged ? (song?.id ?? "") : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-accent-blue/20 px-5 py-3">
        <div className="flex flex-col gap-0.5">
          <DialogTitle className="flex items-center gap-1.5 font-heading text-lg text-foreground">
            <span aria-hidden>♡</span> Dear diary
          </DialogTitle>
          <DialogDescription>{formattedDate}</DialogDescription>
        </div>
        <DialogClose
          disabled={isSaving}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>

      <div className="flex max-h-[min(70vh,40rem)] flex-col gap-5 overflow-y-auto px-6 py-5">
        <MoodSelector value={mood} onChange={setMood} />

        <Field>
          <FieldLabel htmlFor="diary-note">What happened that day?</FieldLabel>
          <Textarea
            id="diary-note"
            placeholder="Tell me about it..."
            rows={4}
            value={note}
            disabled={isSaving}
            onChange={(event) => setNote(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>
            Add a few photos{" "}
            <span className="font-normal text-muted-foreground">
              (up to {MAX_PHOTOS})
            </span>
          </FieldLabel>
          <DiaryPhotoPicker
            photos={photos}
            savedPhotoUrls={existingEntry?.photoUrls}
            disabled={isSaving}
            onAddFiles={addFiles}
            onRemove={removePhoto}
          />
        </Field>

        <Field>
          <FieldLabel>
            Song of the day{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <SongPicker value={song} onChange={setSong} disabled={isSaving} />
        </Field>
      </div>

      <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
        <Button type="button" variant="outline" disabled={isSaving} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!mood || !isDirty || isSaving}>
          {isSaving ? (
            <Spinner size="sm" className="border-primary-foreground border-t-transparent" />
          ) : (
            <>
              Save my day <span aria-hidden>♡</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
