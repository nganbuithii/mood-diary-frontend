"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

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
import type { Mood } from "@/components/mood-diary/mood.constants";
import { SongPicker } from "@/components/mood-diary/song-picker";
import { formatDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";
import type { Song } from "@/features/songs/types/song.types";

const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

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
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [song, setSong] = useState<Song | null>(existingEntry?.song ?? null);
  const photosRef = useRef(photos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const savedPhotoUrls = existingEntry?.photoUrls ?? [];
  const showSavedPhotos = photos.length === 0 && savedPhotoUrls.length > 0;
  const displayedPhotoCount = showSavedPhotos ? savedPhotoUrls.length : photos.length;
  const canAddPhoto = displayedPhotoCount < MAX_PHOTOS;
  const openFilePicker = () => fileInputRef.current?.click();

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!mood) return;

    const isSongChanged = song?.id !== existingEntry?.song?.id;
    onSave({
      mood,
      note,
      photos: photos.map((photo) => photo.file),
      songId: isSongChanged ? (song?.id ?? "") : undefined,
    });
  };

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const accepted: SelectedPhoto[] = [];
    for (const file of files) {
      if (accepted.length >= remainingSlots) {
        toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose image files only.");
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        toast.error("Each photo must be smaller than 5MB.");
        continue;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) {
      setPhotos((current) => [...current, ...accepted]);
    }
  };

  const handleRemovePhoto = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setPhotos((current) => current.filter((photo) => photo.previewUrl !== previewUrl));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
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
          <div className="flex flex-wrap gap-2">
            {showSavedPhotos &&
              savedPhotoUrls.map((url) => (
                <div
                  key={url}
                  className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm sm:size-20"
                >
                  <img src={url} alt="" className="size-full object-cover" />
                </div>
              ))}

            {photos.map(({ previewUrl }) => (
              <div
                key={previewUrl}
                className="group/photo relative size-16 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm sm:size-20"
              >
                <img src={previewUrl} alt="" className="size-full object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemovePhoto(previewUrl)}
                  disabled={isSaving}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 size-5 rounded-full bg-foreground/70 text-background opacity-0 hover:bg-foreground/90 hover:text-background group-hover/photo:opacity-100 focus-visible:opacity-100"
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}

            {canAddPhoto && (
              <Button
                type="button"
                variant="outline"
                onClick={openFilePicker}
                disabled={isSaving}
                className="h-16 w-16 flex-col gap-1 border-dashed border-primary/40 px-0 text-primary-hover hover:border-primary hover:bg-primary/5 hover:text-primary-hover sm:h-20 sm:w-20"
              >
                <ImagePlus className="size-5" />
                <span className="text-[0.65rem]">Add</span>
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFilesSelected}
            disabled={isSaving}
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
        <Button type="submit" disabled={!mood || isSaving}>
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
