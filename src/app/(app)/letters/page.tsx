"use client";

import { use } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { PageHeader, PageSection, PageShell } from "@/components/layout/page-shell";
import { Envelope } from "@/components/letters/envelope";
import { LetterCard, LetterCardSkeleton, NewLetterTile } from "@/components/letters/letter-card";
import { MailArrivedBanner } from "@/components/letters/mail-arrived-banner";
import { useLetters } from "@/features/letters/hooks/use-letters";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";

const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function summaryLine(ready: number, sealed: number, opened: number) {
  return [
    ready > 0 && `${plural(ready, "letter")} waiting`,
    sealed > 0 && `${sealed} on the way`,
    opened > 0 && `${opened} read`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default function LettersPage({ searchParams }: { searchParams: Promise<{ sealed?: string }> }) {
  const justSealedId = use(searchParams).sealed;
  const { data: letters, isPending, isError, refetch } = useLetters();

  const byStatus = (status: LetterSummaryDto["status"]) => letters?.filter((letter) => letter.status === status) ?? [];
  const ready = byStatus("ready");
  const sealed = byStatus("sealed");
  const opened = byStatus("opened");

  return (
    <PageShell glows={["bg-primary/20", "bg-mood-very-happy/20"]}>
      <PageHeader
        eyebrow="💌 letters to future you"
        title="Letterbox"
        description={
          letters?.length
            ? summaryLine(ready.length, sealed.length, opened.length)
            : "Write to yourself today, seal it, and let it find you on the day you choose."
        }
        actions={
          <Button
            size="lg"
            className="rounded-full"
            render={
              <Link href="/letters/new">
                <PenLine data-icon="inline-start" />
                Write a letter
              </Link>
            }
          />
        }
      />

      {isError ? (
        <ErrorState message="Couldn't open your letterbox. Please try again." onRetry={() => refetch()} />
      ) : isPending ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 3 }, (_, index) => (
            <LetterCardSkeleton key={index} />
          ))}
        </div>
      ) : letters.length === 0 ? (
        <EmptyState
          illustration={
            <div className="w-full max-w-56 -rotate-3">
              <Envelope status="sealed" mood={null} />
            </div>
          }
          title="Your letterbox is empty"
          description="Tell future you how today feels: a worry, a hope, a tiny happy thing. It stays sealed until the day you pick."
          action={
            <Button size="lg" className="rounded-full" render={<Link href="/letters/new">Write your first letter ♡</Link>} />
          }
        />
      ) : (
        <>
          {ready.length > 0 && <MailArrivedBanner letters={ready} />}

          <PageSection title="On the way" description="Sealed and travelling to you. No peeking ✦">
            <div className={GRID_CLASS}>
              {sealed.map((letter) => (
                <LetterCard key={letter.id} letter={letter} isNew={letter.id === justSealedId} />
              ))}
              <NewLetterTile />
            </div>
          </PageSection>

          {opened.length > 0 && (
            <PageSection title="Already read" description="Letters you've opened, kept safe here.">
              <div className={GRID_CLASS}>
                {opened.map((letter) => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            </PageSection>
          )}
        </>
      )}
    </PageShell>
  );
}
