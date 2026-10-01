"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Envelope } from "@/components/letters/envelope";
import { LetterPaper } from "@/components/letters/opened-letter";
import { formatRelativeDay } from "@/components/calendar/calendar.utils";
import { useDeleteLetter, useLetters, useOpenLetter } from "@/features/letters/hooks/use-letters";
import { formatLongDate, opensInLabel } from "@/features/letters/utils/letter-dates";
import { ApiError } from "@/lib/api/http-error";

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: letters, isPending } = useLetters();
  const openLetter = useOpenLetter();
  const deleteLetter = useDeleteLetter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const summary = letters?.find((letter) => letter.id === id);
  const opened = openLetter.data;

  const handleOpen = () =>
    openLetter.mutate(id, {
      onError: (error) =>
        toast.error(error instanceof ApiError ? error.message : "Couldn't open this letter. Please try again."),
    });

  const handleDelete = () =>
    deleteLetter.mutate(id, {
      onSuccess: () => {
        toast.success("Letter deleted");
        router.push("/letters");
      },
      onError: (error) =>
        toast.error(error instanceof ApiError ? error.message : "Couldn't delete this letter. Please try again."),
    });

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-primary/20 blur-3xl"
      />

      <main className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Link
          href="/letters"
          className="flex w-fit items-center gap-1.5 rounded-full text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <ArrowLeft aria-hidden className="size-4" /> Letterbox
        </Link>

        {isPending ? (
          <div className="flex justify-center py-24">
            <Spinner />
          </div>
        ) : !summary ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface/70 px-6 py-16 text-center ring-1 ring-foreground/5">
            <p className="font-heading text-xl text-foreground">This letter isn&apos;t here</p>
            <p className="text-sm text-muted-foreground">It may have been deleted.</p>
            <Button className="rounded-full" render={<Link href="/letters">Back to letterbox</Link>} />
          </div>
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
          <section className="flex flex-col items-center gap-6 text-center">
            <button
              type="button"
              onClick={handleOpen}
              disabled={summary.status === "sealed" || openLetter.isPending}
              aria-label={summary.status === "sealed" ? "This letter is still sealed" : "Open this letter"}
              className="group w-full max-w-sm rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-default"
            >
              <Envelope
                status={summary.status}
                mood={summary.moodAtWriting}
                isOpen={openLetter.isPending}
                className={cn(
                  "transition-transform",
                  summary.status !== "sealed" && "group-hover:-rotate-2 group-hover:scale-[1.02] motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100",
                )}
              />
            </button>

            {summary.status === "sealed" ? (
              <div className="flex flex-col items-center gap-1">
                <p className="flex items-center gap-1.5 font-heading text-xl text-foreground">
                  <Lock aria-hidden className="size-4 text-primary-hover" />
                  {opensInLabel(summary.deliverAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Sealed on {formatLongDate(summary.createdAt)} · arrives {formatLongDate(summary.deliverAt)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <p className="font-heading text-xl text-foreground">
                  {summary.status === "ready" ? "A letter from your past self ♡" : "You've read this one before"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Sealed {formatRelativeDay(new Date(summary.createdAt), new Date())}, on{" "}
                  {formatLongDate(summary.createdAt)}.
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="mt-3 rounded-full"
                  disabled={openLetter.isPending}
                  onClick={handleOpen}
                >
                  {openLetter.isPending ? (
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
        )}

        {summary && (
          <div className="flex justify-center">
            {isConfirmingDelete ? (
              <div
                role="alert"
                className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-center sm:flex-row"
              >
                <p className="text-sm text-foreground">
                  Delete this letter for good?
                  {summary.status === "sealed" && " You'll never get to read it."}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={deleteLetter.isPending}
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Keep it
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-full"
                    disabled={deleteLetter.isPending}
                    onClick={handleDelete}
                  >
                    {deleteLetter.isPending ? <Spinner size="sm" /> : "Delete"}
                  </Button>
                </div>
              </div>
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
      </main>
    </div>
  );
}
