"use client";

import Link from "next/link";
import { cn } from "cn";

import { useLetters } from "@/features/letters/hooks/use-letters";
import { opensInLabel } from "@/features/letters/utils/letter-dates";

export function LetterboxCard() {
  const { data: letters } = useLetters();
  if (!letters) return null;

  const ready = letters.filter((letter) => letter.status === "ready");
  const nextSealed = letters.find((letter) => letter.status === "sealed");

  const { href, title, subtitle } =
    ready.length > 0
      ? {
          href: ready.length === 1 ? `/letters/${ready[0].id}` : "/letters",
          title: ready.length === 1 ? "A letter from your past self is here" : `${ready.length} letters are waiting for you`,
          subtitle: "Open it whenever you're ready ♡",
        }
      : nextSealed
        ? { href: "/letters", title: "A letter is on its way", subtitle: `${opensInLabel(nextSealed.deliverAt)} ✦` }
        : { href: "/letters/new", title: "Write to future you", subtitle: "Seal it today, open it on the day you choose." };

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-3xl bg-surface/90 p-4 shadow-sm ring-1 ring-foreground/5 transition-all outline-none hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/60 motion-reduce:hover:translate-y-0",
        ready.length > 0 && "ring-2 ring-primary-hover/50",
      )}
    >
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-2xl transition-transform group-hover:-rotate-6"
      >
        💌
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-heading text-base text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </Link>
  );
}
