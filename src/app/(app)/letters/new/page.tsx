"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmBar } from "@/components/ui/confirm-bar";
import { BackLink, PageHeader, PageShell } from "@/components/layout/page-shell";
import { ComposeStep } from "@/components/letters/compose-step";
import { DeliveryDayPicker, formatDeliveryDay } from "@/components/letters/delivery-day-picker";
import { LetterBodyField, type LetterBodyFieldHandle } from "@/components/letters/letter-body-field";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";
import { clearLetterDraft, readLetterDraft, useAutosaveLetterDraft } from "@/features/letters/hooks/use-letter-draft";
import { useCreateLetter } from "@/features/letters/hooks/use-letters";
import { MAX_LETTER_LENGTH } from "@/features/letters/types/letter.types";
import { addMonthsClamped, deliverAtFor } from "@/features/letters/utils/letter-dates";
import { ApiError } from "@/lib/api/http-error";

const subscribeNoop = () => () => {};

export default function NewLetterPage() {
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return isClient ? <LetterComposer /> : null;
}

function LetterComposer() {
  const router = useRouter();
  const createLetter = useCreateLetter();
  const bodyRef = useRef<LetterBodyFieldHandle>(null);

  const [restoredDraft] = useState(readLetterDraft);
  const [body, setBody] = useState(restoredDraft?.body ?? "");
  const [mood, setMood] = useState<Mood | null>(restoredDraft?.mood ?? null);
  const [deliveryDay, setDeliveryDay] = useState(() => restoredDraft?.deliveryDay ?? addMonthsClamped(new Date(), 12));
  const [isConfirming, setIsConfirming] = useState(false);

  const isDraftSaved = useAutosaveLetterDraft({ body, mood, deliveryDay }, { paused: createLetter.isSuccess });

  const trimmed = body.trim();
  const canSeal = trimmed.length > 0 && body.length <= MAX_LETTER_LENGTH && !createLetter.isPending;

  const hasAnnouncedDraft = useRef(false);
  useEffect(() => {
    if (!restoredDraft || hasAnnouncedDraft.current) return;
    hasAnnouncedDraft.current = true;
    toast("Picked up where you left off ✎");
  }, [restoredDraft]);

  const startOver = () => {
    setBody("");
    setMood(null);
    setIsConfirming(false);
    clearLetterDraft();
    bodyRef.current?.focus();
  };

  const seal = () =>
    createLetter.mutate(
      { body: trimmed, deliverAt: deliverAtFor(deliveryDay), moodAtWriting: mood ?? undefined },
      {
        onSuccess: (letter) => {
          clearLetterDraft();
          toast.success("Sealed and on its way ✉️");
          router.push(`/letters?sealed=${letter.id}`);
        },
        onError: (error) => {
          setIsConfirming(false);
          toast.error(error instanceof ApiError ? error.message : "Couldn't seal your letter. Please try again.");
        },
      },
    );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSeal) setIsConfirming(true);
  };

  return (
    <PageShell width="medium" glows={["bg-primary/20", "bg-accent-blue/20"]} className="gap-6">
      <div className="flex items-center justify-between gap-3">
        <BackLink href="/letters">Letterbox</BackLink>
        <span aria-live="polite" className="text-xs text-muted-foreground">
          {isDraftSaved && "Draft saved on this device ✓"}
        </span>
      </div>

      <PageHeader
        title="A letter to future you"
        description="Write freely. No one else will ever read it, and you won't either until the day it arrives."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <ComposeStep number={1} title="Write your letter">
          <LetterBodyField ref={bodyRef} value={body} disabled={createLetter.isPending} onChange={setBody} />
        </ComposeStep>

        <ComposeStep number={2} title="When should it arrive?">
          <DeliveryDayPicker value={deliveryDay} onChange={setDeliveryDay} />
        </ComposeStep>

        <ComposeStep number={3} title="How are you feeling right now?" hint="Optional · it tints the envelope">
          <div className="flex flex-col items-center gap-2">
            <MoodSelector value={mood} onChange={setMood} />
            {mood && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setMood(null)}
              >
                Feeling {MOOD_META[mood].label.toLowerCase()} · clear
              </Button>
            )}
          </div>
        </ComposeStep>

        {isConfirming ? (
          <ConfirmBar
            icon={<Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-hover" />}
            message={
              <>
                Ready to seal? You won&apos;t be able to read or change it until{" "}
                <span className="font-medium">{formatDeliveryDay(deliveryDay)}</span>.
              </>
            }
            confirmLabel="Seal it ♡"
            cancelLabel="Keep writing"
            pendingLabel="Sealing…"
            isPending={createLetter.isPending}
            onConfirm={seal}
            onCancel={() => setIsConfirming(false)}
          />
        ) : (
          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            {trimmed ? (
              <Button
                type="button"
                variant="link"
                className="self-center text-muted-foreground hover:text-destructive"
                onClick={startOver}
              >
                Start over
              </Button>
            ) : (
              <span className="text-center text-xs text-muted-foreground sm:text-left">
                Write a few words to seal your letter
              </span>
            )}
            <Button type="submit" size="lg" className="rounded-full" disabled={!canSeal}>
              <Lock data-icon="inline-start" />
              Seal this letter
            </Button>
          </div>
        )}
      </form>
    </PageShell>
  );
}
