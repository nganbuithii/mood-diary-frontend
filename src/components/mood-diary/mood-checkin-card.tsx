"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import type { Mood } from "@/components/mood-diary/mood.constants";

const DIARY_ACTIONS = [
  { label: "Photo", emoji: "📷" },
  { label: "Music", emoji: "🎵" },
] as const;

export function MoodCheckinCard() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <RetroWindow title="Dear Diary" accent className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            ୨୧ {today} ୨୧
          </span>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
            Dear diary,
          </h1>
          <p className="text-sm text-muted-foreground">
            today I&apos;m feeling...
          </p>
        </div>

        <MoodSelector value={mood} onChange={setMood} />

        <Field className="text-left">
          <FieldLabel htmlFor="note" className="font-heading text-base">
            What&apos;s on your mind today? <span aria-hidden>♡</span>
          </FieldLabel>
          <Textarea
            id="note"
            placeholder="Tell me about your day..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
          />
        </Field>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {DIARY_ACTIONS.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-full"
            >
              <span aria-hidden>{action.emoji}</span>
              {action.label}
            </Button>
          ))}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!mood}
          className="w-full sm:w-auto sm:px-8"
        >
          Save my day <span aria-hidden>♡</span>
        </Button>
      </form>
    </RetroWindow>
  );
}
