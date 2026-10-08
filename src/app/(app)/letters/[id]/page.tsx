"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { ConfirmBar } from "@/components/ui/confirm-bar";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { BackLink, PageShell } from "@/components/layout/page-shell";
import { Countdown, useNow } from "@/components/letters/countdown";
import { Envelope } from "@/components/letters/envelope";
import { JourneyTrack } from "@/components/letters/journey-track";
import { LetterPaper } from "@/components/letters/opened-letter";
import { formatRelativeDay } from "@/lib/date";
import { LETTER_STATUS } from "@/features/letters/constants/letter.constants";
import {
  useDeleteLetter,
  useLetters,
  useOpenedLetter,
  useOpenLetter,
  useRefreshLetters,
} from "@/features/letters/hooks/use-letters";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";
import { formatLongDate, formatOpeningTime } from "@/features/letters/utils/letter-dates";
import { ApiError } from "@/lib/api/http-error";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: letters, isPending, isError, refetch } = useLetters();
  const openLetter = useOpenLetter();
  const deleteLetter = useDeleteLetter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const summary = letters?.find((letter) => letter.id === id);
  const { data: opened } = useOpenedLetter(id);

  const handleOpen = () =>
    openLetter.mutate(id, {
      onError: (error) => toast.error(errorMessage(error, "Couldn't open this letter. Please try again.")),
    });

  const handleDelete = () =>
    deleteLetter.mutate(id, {
      onSuccess: () => {
        toast.success("Letter deleted");
        router.push("/letters");
      },
      onError: (error) => toast.error(errorMessage(error, "Couldn't delete this letter. Please try again.")),
    });

  return (
    <PageShell width="narrow" className="gap-6">
      <BackLink href="/letters">Letterbox</BackLink>

      {isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : isError && !letters ? (
        <ErrorState message="Couldn't open this letter. Please try again." onRetry={() => refetch()} />
      ) : !summary ? (
        <EmptyState
          title="This letter isn't here"
          description="It may have been deleted."
          action={<Button className="rounded-full" render={<Link href="/letters">Back to letterbox</Link>} />}
        />
      ) : opened ? (
        <article className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700">
          <LetterPaper
            body={opened.body}
            mood={opened.moodAtWriting}
            writtenOn={formatLongDate(opened.createdAt)}
            writtenAgo={`Written ${formatRelativeDay(new Date(opened.createdAt), new Date())}`}
          />
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">How does it feel to read this today?</p>
            <Button
              size="lg"
              className="rounded-full"
              render={
                <Link href="/letters/new">
                  <PenLine data-icon="inline-start" />
                  Write back to future you
                </Link>
              }
            />
          </div>
        </article>
      ) : (
        <ClosedLetter summary={summary} isOpening={openLetter.isPending} onOpen={handleOpen} />
      )}

      {summary && (
        <div className="flex justify-center">
          {isConfirmingDelete ? (
            <ConfirmBar
              tone="destructive"
              message={
                <>
                  Delete this letter for good?
                  {summary.status === LETTER_STATUS.SEALED && " You'll never get to read it."}
                </>
              }
              confirmLabel="Delete"
              cancelLabel="Keep it"
              isPending={deleteLetter.isPending}
              onConfirm={handleDelete}
              onCancel={() => setIsConfirmingDelete(false)}
            />
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => setIsConfirmingDelete(true)}
            >
              <Trash2 data-icon="inline-start" />
              Delete letter
            </Button>
          )}
        </div>
      )}
    </PageShell>
  );
}

function ClosedLetter({
  summary,
  isOpening,
  onOpen,
}: {
  summary: LetterSummaryDto;
  isOpening: boolean;
  onOpen: () => void;
}) {
  const isSealed = summary.status === LETTER_STATUS.SEALED;

  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <button
        type="button"
        onClick={onOpen}
        disabled={isSealed || isOpening}
        aria-label={isSealed ? "This letter is still sealed" : "Open this letter"}
        className="group w-full max-w-sm rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-default"
      >
        <Envelope
          status={summary.status}
          mood={summary.moodAtWriting}
          isOpen={isOpening}
          className={cn(
            "transition-transform",
            !isSealed &&
              "group-hover:-rotate-2 group-hover:scale-[1.02] motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100",
          )}
        />
      </button>

      {isSealed ? (
        <SealedCountdown summary={summary} />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className="font-heading text-xl text-foreground">
            {summary.status === LETTER_STATUS.READY ? "A letter from your past self ♡" : "You've read this one before"}
          </p>
          <p className="text-sm text-muted-foreground">
            Sealed {formatRelativeDay(new Date(summary.createdAt), new Date())}, on {formatLongDate(summary.createdAt)}.
          </p>
          <Button type="button" size="lg" className="mt-3 rounded-full" disabled={isOpening} onClick={onOpen}>
            {isOpening ? (
              <>
                <Spinner size="sm" /> Opening…
              </>
            ) : (
              "Tap to open ♡"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}

function SealedCountdown({ summary }: { summary: LetterSummaryDto }) {
  const now = useNow();
  const refreshLetters = useRefreshLetters();

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-1">
        <p className="flex items-center gap-1.5 font-heading text-xl text-foreground">
          <Lock aria-hidden className="size-4 text-primary-hover" />
          Still sealed · no peeking
        </p>
        <p className="text-sm text-muted-foreground">
          It opens on <span className="font-medium text-foreground">{formatLongDate(summary.deliverAt)}</span> at{" "}
          {formatOpeningTime()}
        </p>
      </div>

      <Countdown target={summary.deliverAt} now={now} onComplete={refreshLetters} className="w-full" />

      <JourneyTrack
        createdAt={summary.createdAt}
        deliverAt={summary.deliverAt}
        now={now}
        size="md"
        className="w-full rounded-2xl bg-surface/70 px-4 py-3 ring-1 ring-foreground/5"
      />
    </div>
  );
}
