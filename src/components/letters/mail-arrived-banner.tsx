import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Envelope } from "@/components/letters/envelope";
import type { LetterSummaryDto } from "@/features/letters/types/letter.types";
import { formatLongDate } from "@/features/letters/utils/letter-dates";

export function MailArrivedBanner({ letters }: { letters: LetterSummaryDto[] }) {
  const [first, ...rest] = letters;

  return (
    <section
      aria-labelledby="mail-arrived"
      className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary/30 via-mood-very-happy/25 to-accent-blue/25 p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8"
    >
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
