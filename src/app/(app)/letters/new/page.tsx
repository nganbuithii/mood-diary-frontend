"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MoodSelector } from "@/components/mood-diary/mood-selector";
import { MOOD_META, type Mood } from "@/components/mood-diary/mood.constants";
import { useCreateLetter } from "@/features/letters/hooks/use-letters";
import { MAX_LETTER_LENGTH } from "@/features/letters/types/letter.types";
import {
  addMonthsClamped,
  deliverAtFor,
  earliestDeliveryDay,
  fromDateInputValue,
  latestDeliveryDay,
  opensInLabel,
  toDateInputValue,
} from "@/features/letters/utils/letter-dates";
import { ApiError } from "@/lib/api/http-error";

const DRAFT_KEY = "moodiary-letter-draft";

const PRESETS = [
  { label: "1 month", months: 1, emoji: "🌱" },
  { label: "6 months", months: 6, emoji: "🌷" },
  { label: "1 year", months: 12, emoji: "🎂" },
  { label: "5 years", months: 60, emoji: "🌳" },
] as const;

const PROMPTS = [
  "Right now, my days look like…",
  "Something I'm worried about is…",
  "I really hope that by now…",
  "A tiny thing that made me smile today:",
  "Please remember that…",
  "Dear me, I'm proud of you for…",
];

interface Draft {
  body: string;
  mood: Mood | null;
  deliveryDay: string;
}

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft.body?.trim() ? draft : null;
  } catch {
    return null;
  }
}

function restoredDay(draft: Draft | null) {
  const day = draft && fromDateInputValue(draft.deliveryDay);
  return day && day >= earliestDeliveryDay() && day <= latestDeliveryDay() ? day : addMonthsClamped(new Date(), 12);
}

const subscribeNoop = () => () => {};

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

export default function NewLetterPage() {
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return isClient ? <LetterComposer /> : null;
}

function LetterComposer() {
  const router = useRouter();
  const createLetter = useCreateLetter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const today = new Date();
  const earliest = earliestDeliveryDay(today);
  const latest = latestDeliveryDay(today);

  const [initialDraft] = useState(readDraft);
  const [body, setBody] = useState(initialDraft?.body ?? "");
  const [mood, setMood] = useState<Mood | null>(initialDraft?.mood ?? null);
  const [deliveryDay, setDeliveryDay] = useState<Date>(() => restoredDay(initialDraft));
  const [isConfirming, setIsConfirming] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saved">("idle");
  const hasAnnouncedDraft = useRef(false);

  const trimmed = body.trim();
  const isDirty = trimmed.length > 0;
  const isTooLong = body.length > MAX_LETTER_LENGTH;
  const canSeal = isDirty && !isTooLong && !createLetter.isPending;

  useEffect(() => {
    if (!initialDraft || hasAnnouncedDraft.current) return;
    hasAnnouncedDraft.current = true;
    toast("Picked up where you left off ✎");
  }, [initialDraft]);

  useEffect(() => {
    if (createLetter.isSuccess) return;
    const timer = setTimeout(() => {
      try {
        if (isDirty) {
          const draft: Draft = { body, mood, deliveryDay: toDateInputValue(deliveryDay) };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
          setDraftStatus("saved");
        } else {
          localStorage.removeItem(DRAFT_KEY);
          setDraftStatus("idle");
        }
      } catch {
        setDraftStatus("idle");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [body, mood, deliveryDay, isDirty, createLetter.isSuccess]);

  const insertPrompt = (prompt: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? body.length;
    const end = textarea?.selectionEnd ?? body.length;
    const before = body.slice(0, start);
    const prefix = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const insert = `${prefix}${prompt} `;
    setBody(before + insert + body.slice(end));
    requestAnimationFrame(() => {
      const caret = start + insert.length;
      textarea?.focus();
      textarea?.setSelectionRange(caret, caret);
    });
  };

  const discardDraft = () => {
    setBody("");
    setMood(null);
    setIsConfirming(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // nothing to clean up
    }
    textareaRef.current?.focus();
  };

  const seal = () => {
    createLetter.mutate(
      { body: trimmed, deliverAt: deliverAtFor(deliveryDay), moodAtWriting: mood ?? undefined },
      {
        onSuccess: (letter) => {
          try {
            localStorage.removeItem(DRAFT_KEY);
          } catch {
            // draft will be overwritten next time
          }
          toast.success("Sealed and on its way ✉️");
          router.push(`/letters?sealed=${letter.id}`);
        },
        onError: (error) => {
          setIsConfirming(false);
          toast.error(error instanceof ApiError ? error.message : "Couldn't seal your letter. Please try again.");
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (canSeal) setIsConfirming(true);
  };

  const deliverAtIso = deliverAtFor(deliveryDay);

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[-10%] size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-0 size-72 rounded-full bg-accent-blue/20 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/letters"
            className="flex w-fit items-center gap-1.5 rounded-full text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <ArrowLeft aria-hidden className="size-4" /> Letterbox
          </Link>
          <span aria-live="polite" className="text-xs text-muted-foreground">
            {draftStatus === "saved" && "Draft saved on this device ✓"}
          </span>
        </div>

        <header className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">A letter to future you</h1>
          <p className="text-sm text-muted-foreground">
            Write freely. No one else will ever read it, and you won&apos;t either until the day it arrives.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Step number={1} title="Write your letter">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles aria-hidden className="size-3.5 text-primary-hover" /> Stuck? Start with one of these
              </span>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={createLetter.isPending}
                    onClick={() => insertPrompt(prompt)}
                    className="shrink-0 rounded-full border border-dashed border-primary/50 bg-primary/5 px-3 py-1 text-sm text-foreground transition-colors outline-none hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-foreground/5 sm:p-7">
              <span aria-hidden className="absolute -top-2 left-10 h-4 w-14 -rotate-3 rounded-[2px] bg-accent-green/60" />
              <span aria-hidden className="absolute -top-2 right-10 h-4 w-14 rotate-2 rounded-[2px] bg-secondary/50" />
              <label htmlFor="letter-body" className="font-heading text-2xl text-foreground">
                Dear future me,
              </label>
              <textarea
                ref={textareaRef}
                id="letter-body"
                value={body}
                disabled={createLetter.isPending}
                onChange={(event) => setBody(event.target.value)}
                placeholder="How are you, really? Today I…"
                rows={12}
                aria-describedby="letter-count"
                className="mt-2 w-full resize-y bg-transparent font-heading text-lg leading-8 text-foreground outline-none placeholder:text-muted-foreground/70 [background-attachment:local] [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(2rem-1px),var(--border)_calc(2rem-1px),var(--border)_2rem)]"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-heading text-base text-muted-foreground">With love, me ♡</span>
                <span
                  id="letter-count"
                  className={cn("text-xs tabular-nums", isTooLong ? "font-medium text-destructive" : "text-muted-foreground")}
                >
                  {isTooLong && "Too long · "}
                  {body.length.toLocaleString()} / {MAX_LETTER_LENGTH.toLocaleString()}
                </span>
              </div>
            </div>
          </Step>

          <Step number={2} title="When should it arrive?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((preset) => {
                const day = addMonthsClamped(today, preset.months);
                const isSelected = toDateInputValue(day) === toDateInputValue(deliveryDay);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDeliveryDay(day)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-2xl border px-3 py-2.5 text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      isSelected
                        ? "border-primary/70 bg-primary/15 font-medium text-foreground shadow-sm"
                        : "border-border bg-surface text-muted-foreground hover:-translate-y-0.5 hover:text-foreground motion-reduce:hover:translate-y-0",
                    )}
                  >
                    <span aria-hidden className="text-xl">
                      {preset.emoji}
                    </span>
                    In {preset.label}
                  </button>
                );
              })}
            </div>

            <label className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              Or pick a special day
              <input
                type="date"
                value={toDateInputValue(deliveryDay)}
                min={toDateInputValue(earliest)}
                max={toDateInputValue(latest)}
                onChange={(event) => {
                  const day = fromDateInputValue(event.target.value);
                  if (day && day >= earliest && day <= latest) setDeliveryDay(day);
                }}
                className="h-9 rounded-full border border-border bg-surface px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              />
              <span className="text-xs">(a birthday, an anniversary, New Year…)</span>
            </label>

            <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3">
              <span aria-hidden className="-rotate-6 text-2xl">
                ✉️
              </span>
              <p className="text-sm text-foreground">
                Arrives <span className="font-medium">{formatDay(deliveryDay)}</span> at 8:00 am
                <span className="block text-xs text-muted-foreground">{opensInLabel(deliverAtIso)}</span>
              </p>
            </div>
          </Step>

          <Step number={3} title="How are you feeling right now?" hint="Optional · it goes on the stamp">
            <div className="flex flex-col items-center gap-2">
              <MoodSelector value={mood} onChange={setMood} />
              {mood && (
                <button
                  type="button"
                  onClick={() => setMood(null)}
                  className="rounded-full text-xs text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  Feeling {MOOD_META[mood].label.toLowerCase()} · clear
                </button>
              )}
            </div>
          </Step>

          {isConfirming ? (
            <div
              role="alert"
              className="flex flex-col gap-4 rounded-3xl border border-primary/40 bg-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="flex items-start gap-2 text-sm text-foreground">
                <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary-hover" />
                <span>
                  Ready to seal? You won&apos;t be able to read or change it until{" "}
                  <span className="font-medium">{formatDay(deliveryDay)}</span>.
                </span>
              </p>
              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={createLetter.isPending}
                  onClick={() => setIsConfirming(false)}
                >
                  Keep writing
                </Button>
                <Button type="button" className="min-w-28 rounded-full" disabled={createLetter.isPending} onClick={seal}>
                  {createLetter.isPending ? (
                    <>
                      <Spinner size="sm" /> Sealing…
                    </>
                  ) : (
                    "Seal it ♡"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              {isDirty ? (
                <button
                  type="button"
                  onClick={discardDraft}
                  className="self-center rounded-full text-sm text-muted-foreground underline-offset-4 outline-none hover:text-destructive hover:underline focus-visible:ring-2 focus-visible:ring-ring/60"
                >
                  Start over
                </button>
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
      </main>
    </div>
  );
}

function Step({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`step-${number}`}
      className="flex flex-col gap-4 rounded-3xl bg-surface/90 p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-8 shrink-0 -rotate-6 items-center justify-center rounded-full bg-primary font-heading text-base text-primary-foreground shadow-sm"
        >
          {number}
        </span>
        <div className="flex flex-col leading-tight">
          <h2 id={`step-${number}`} className="font-heading text-xl text-foreground">
            {title}
          </h2>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </div>
      {children}
    </section>
  );
}
