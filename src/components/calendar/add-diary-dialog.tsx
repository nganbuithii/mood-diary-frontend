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
import { Textarea } from "@/components/ui/textarea";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import type { Mood } from "@/components/mood-diary/mood.constants";
import { formatDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntry } from "@/components/calendar/calendar.types";

interface AddDiaryDialogProps {
  date: Date | null;
  existingEntry?: DiaryEntry;
  onOpenChange: (open: boolean) => void;
  onSave: (mood: Mood, note: string) => void;
}

export function AddDiaryDialog({
  date,
  existingEntry,
  onOpenChange,
  onSave,
}: AddDiaryDialogProps) {
  return (
    <Dialog open={date !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md"
      >
        {date && (
          <DiaryForm
            key={formatDateKey(date)}
            date={date}
            existingEntry={existingEntry}
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
  onCancel: () => void;
  onSave: (mood: Mood, note: string) => void;
}

function DiaryForm({ date, existingEntry, onCancel, onSave }: DiaryFormProps) {
  const [mood, setMood] = useState<Mood | null>(existingEntry?.mood ?? null);
  const [note, setNote] = useState(existingEntry?.note ?? "");

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!mood) return;
    onSave(mood, note);
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
        <span aria-hidden className="hidden items-center gap-1.5 sm:flex">
          <span className="size-2.5 rounded-full bg-mood-happy" />
          <span className="size-2.5 rounded-full bg-mood-neutral" />
          <span className="size-2.5 rounded-full bg-mood-sad" />
        </span>
        <DialogClose className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5">
        <MoodSelector value={mood} onChange={setMood} />

        <Field>
          <FieldLabel htmlFor="diary-note">What happened that day?</FieldLabel>
          <Textarea
            id="diary-note"
            placeholder="Tell me about it..."
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Field>
      </div>

      <DialogFooter className="border-t border-border bg-muted/30 px-6 py-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!mood}>
          Save my day <span aria-hidden>♡</span>
        </Button>
      </DialogFooter>
    </form>
  );
}
