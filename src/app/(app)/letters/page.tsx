"use client";

import { use } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Envelope } from "@/components/letters/envelope";
import { LetterCard, LetterCardSkeleton, NewLetterTile } from "@/components/letters/letter-card";
import { useLetters } from "@/features/letters/hooks/use-letters";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";
import { formatLongDate } from "@/features/letters/utils/letter-dates";

const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default function LettersPage({ searchParams }: { searchParams: Promise<{ sealed?: string }> }) {
  const justSealedId = use(searchParams).sealed;
  const { data: letters, isPending, isError, refetch } = useLetters();

  const ready = letters?.filter((letter) => letter.status === "ready") ?? [];
  const sealed = letters?.filter((letter) => letter.status === "sealed") ?? [];
  const opened = letters?.filter((letter) => letter.status === "opened") ?? [];

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-mood-very-happy/20 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="w-fit -rotate-2 rounded-full bg-surface/80 px-3 py-0.5 font-heading text-sm text-primary-hover shadow-sm">
              💌 letters to future you
            </span>
            <h1 className="font-heading text-3xl text-foreground sm:text-4xl">Letterbox</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              {letters && letters.length > 0
                ? [
                    ready.length > 0 && `${plural(ready.length, "letter")} waiting`,
                    sealed.length > 0 && `${sealed.length} on the way`,
                    opened.length > 0 && `${opened.length} read`,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : "Write to yourself today, seal it, and let it find you on the day you choose."}
            </p>
          </div>
          <Button
            size="lg"
            className="self-start rounded-full sm:self-auto"
            render={
              <Link href="/letters/new">
                <PenLine data-icon="inline-start" />
                Write a letter
              </Link>
            }
          />
        </header>

        {isError ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">Couldn&apos;t open your letterbox. Please try again.</p>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isPending ? (
          <div className={GRID_CLASS}>
            {Array.from({ length: 3 }, (_, index) => (
              <LetterCardSkeleton key={index} />
            ))}
          </div>
        ) : letters.length === 0 ? (
          <EmptyLetterbox />
        ) : (
          <>
            {ready.length > 0 && <MailArrived letters={ready} />}

            <Section title="On the way" subtitle="Sealed and travelling to you. No peeking ✦">
              <div className={GRID_CLASS}>
                {sealed.map((letter) => (
                  <LetterCard key={letter.id} letter={letter} isNew={letter.id === justSealedId} />
                ))}
                <NewLetterTile />
              </div>
            </Section>

            {opened.length > 0 && (
              <Section title="Already read" subtitle="Letters you've opened, kept safe here.">
                <div className={GRID_CLASS}>
                  {opened.map((letter) => (
                    <LetterCard key={letter.id} letter={letter} />
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function MailArrived({ letters }: { letters: LetterSummaryDto[] }) {
  const [first, ...rest] = letters;

  return (
    <section
      aria-labelledby="mail-arrived"
      className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary/30 via-mood-very-happy/25 to-accent-blue/25 p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8"
    >
      <span aria-hidden className="absolute top-4 right-6 rotate-12 font-heading text-3xl text-primary-hover/40">
        ♡
      </span>
      <span aria-hidden className="absolute bottom-5 left-[45%] font-heading text-xl text-white/70">
        ✦
      </span>

      <div className="relative flex flex-col items-center gap-6 sm:flex-row">
        <Link
          href={`/letters/${first.id}`}
          aria-label="Open your letter"
          className="group w-full max-w-60 shrink-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <Envelope
            status="ready"
            mood={first.moodAtWriting}
            className="-rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-105 motion-reduce:transition-none"
          />
        </Link>

        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <h2 id="mail-arrived" className="font-heading text-2xl text-foreground sm:text-3xl">
            You&apos;ve got mail! 💌
          </h2>
          <p className="text-sm text-foreground/75">
            {letters.length === 1
              ? `A letter you sealed on ${formatLongDate(first.createdAt)} just arrived.`
              : `${letters.length} letters from your past self have arrived.`}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button size="lg" className="rounded-full" render={<Link href={`/letters/${first.id}`}>Open it now ♡</Link>} />
            {rest.map((letter, index) => (
              <Button
                key={letter.id}
                size="lg"
                variant="outline"
                className="rounded-full"
                render={<Link href={`/letters/${letter.id}`}>Letter {index + 2}</Link>}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyLetterbox() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-surface/70 px-6 py-14 text-center ring-1 ring-foreground/5">
      <div className="w-full max-w-56 -rotate-3">
        <Envelope status="sealed" mood={null} />
      </div>
      <p className="font-heading text-2xl text-foreground">Your letterbox is empty</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Tell future you how today feels: a worry, a hope, a tiny happy thing. It stays sealed until the day you pick.
      </p>
      <Button size="lg" className="rounded-full" render={<Link href="/letters/new">Write your first letter ♡</Link>} />
    </div>
  );
}
