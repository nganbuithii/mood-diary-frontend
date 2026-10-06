"use client";

import Link from "next/link";
import { cn } from "cn";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import { LETTER_STATUS } from "@/features/letters/constants/letter.constants";
import { useLetters } from "@/features/letters/hooks/use-letters";
import { opensInLabel } from "@/features/letters/utils/letter-dates";

export function LetterboxCard() {
  const { data: letters } = useLetters();
  if (!letters) return null;

  const ready = letters.filter((letter) => letter.status === LETTER_STATUS.READY);
  const nextSealed = letters.find((letter) => letter.status === LETTER_STATUS.SEALED);

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
    <Link href={href} className="group block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
      <Card
        className={cn(
          "flex-row items-center gap-3 rounded-3xl border-transparent bg-surface/90 p-4 ring-1 ring-foreground/5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-md motion-reduce:group-hover:translate-y-0",
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
          <CardTitle className="font-normal text-foreground">{title}</CardTitle>
          <CardDescription className="text-xs">{subtitle}</CardDescription>
        </span>
      </Card>
    </Link>
  );
}
