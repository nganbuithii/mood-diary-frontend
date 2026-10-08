"use client";

import { useState, type ReactNode } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { DiaryPhotoPicker, MAX_PHOTOS, useDiaryPhotos } from "@/components/mood-diary/diary-photo-picker";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import { SongPicker } from "@/components/songs/song-picker";
import type { DiaryEntryDto } from "@/features/diary/types/diary-entry.types";
import type { UpsertDiaryEntryRequest } from "@/features/diary/types/diary-entry.types";
import type { Mood } from "@/features/diary/types/mood.types";
import type { Song } from "@/features/songs/types/song.types";

export type DiaryEntryValues = Omit<UpsertDiaryEntryRequest, "date">;

export function useDiaryEntryForm(existingEntry?: DiaryEntryDto) {
  const [mood, setMood] = useState<Mood | null>(existingEntry?.mood ?? null);
  const [note, setNote] = useState(existingEntry?.note ?? "");
  const [song, setSong] = useState<Song | null>(existingEntry?.song ?? null);
  const { photos, addFiles, removePhoto, isProcessing } = useDiaryPhotos();

  const isSongChanged = song?.id !== existingEntry?.song?.id;
  const isDirty =
    mood !== (existingEntry?.mood ?? null) ||
    note.trim() !== (existingEntry?.note ?? "").trim() ||
    photos.length > 0 ||
    isSongChanged;

  const values: DiaryEntryValues | null =
    mood && isDirty && !isProcessing
      ? {
          mood,
          note: note.trim() || undefined,
          photos: photos.map((photo) => photo.file),
          songId: isSongChanged ? (song?.id ?? "") : undefined,
        }
      : null;

  return {
    existingEntry,
    mood,
    setMood,
    note,
    setNote,
    song,
    setSong,
    photos,
    addFiles,
    removePhoto,
    isProcessingPhotos: isProcessing,
    values,
  };
}

type DiaryEntryForm = ReturnType<typeof useDiaryEntryForm>;

interface DiaryEntryFieldsProps {
  form: DiaryEntryForm;
  disabled?: boolean;
  noteId: string;
  noteLabel: ReactNode;
  notePlaceholder: string;
  noteLabelClassName?: string;
  collapsibleExtras?: boolean;
}

export function DiaryEntryFields({
  form,
  disabled = false,
  noteId,
  noteLabel,
  notePlaceholder,
  noteLabelClassName,
  collapsibleExtras = false,
}: DiaryEntryFieldsProps) {
  const savedPhotoUrls = form.existingEntry?.photoUrls ?? [];
  const [isPhotoOpen, setIsPhotoOpen] = useState(!collapsibleExtras || savedPhotoUrls.length > 0);
  const [isMusicOpen, setIsMusicOpen] = useState(!collapsibleExtras || form.song !== null);

  const toggles = [
    { label: "Photo", emoji: "📷", isOpen: isPhotoOpen, toggle: () => setIsPhotoOpen((open) => !open) },
    { label: "Music", emoji: "🎵", isOpen: isMusicOpen, toggle: () => setIsMusicOpen((open) => !open) },
  ];

  return (
    <>
      <MoodSelector value={form.mood} onChange={form.setMood} disabled={disabled} />

      <Field className="text-left">
        <FieldLabel htmlFor={noteId} className={noteLabelClassName}>
          {noteLabel}
        </FieldLabel>
        <Textarea
          id={noteId}
          placeholder={notePlaceholder}
          rows={4}
          value={form.note}
          disabled={disabled}
          onChange={(event) => form.setNote(event.target.value)}
        />
      </Field>

      {collapsibleExtras && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {toggles.map((toggle) => (
            <Button
              key={toggle.label}
              type="button"
              variant="outline"
              size="sm"
              aria-expanded={toggle.isOpen}
              onClick={toggle.toggle}
              className={cn("gap-1.5 rounded-full", toggle.isOpen && "border-primary/60 bg-primary/10")}
            >
              <span aria-hidden>{toggle.emoji}</span>
              {toggle.label}
            </Button>
          ))}
        </div>
      )}

      {isPhotoOpen && (
        <Field className="text-left">
          <FieldLabel>
            Add a few photos <span className="font-normal text-muted-foreground">(up to {MAX_PHOTOS})</span>
          </FieldLabel>
          <DiaryPhotoPicker
            photos={form.photos}
            savedPhotoUrls={savedPhotoUrls}
            disabled={disabled}
            isProcessing={form.isProcessingPhotos}
            onAddFiles={form.addFiles}
            onRemove={form.removePhoto}
          />
        </Field>
      )}

      {isMusicOpen && (
        <Field className="text-left">
          <FieldLabel>
            Song of the day <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <SongPicker value={form.song} onChange={form.setSong} disabled={disabled} />
        </Field>
      )}
    </>
  );
}
