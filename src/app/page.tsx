import Image from "next/image";
import Link from "next/link";
import { CalendarHeart, PenLine, Smile, Sparkles } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { MoodPolaroid } from "@/components/mood-diary/mood-polaroid";

const STEPS = [
  {
    icon: Smile,
    title: "Pick a mood",
    description: "One gentle tap on the emoji that matches today.",
  },
  {
    icon: PenLine,
    title: "Add a little note",
    description: "A sentence or a whole page — whatever feels right.",
  },
  {
    icon: CalendarHeart,
    title: "Watch it add up",
    description: "Every entry becomes a small polaroid in your story.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <div className="relative isolate overflow-hidden bg-[url('/images/bg_home.png')] bg-contain bg-top bg-no-repeat lg:bg-cover lg:bg-center lg:bg-fixed">
        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          {/* Hero */}
          <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary-hover" aria-hidden />
                A cozier way to journal
              </span>

              <h1 className="font-heading text-4xl text-foreground sm:text-5xl">
                A cozy little home for your everyday feelings{" "}
                <span aria-hidden>♡</span>
              </h1>
              <p className="max-w-md text-base text-muted-foreground sm:text-lg">
                Check in with how you feel, save the small moments, and look
                back on your story — one gentle page at a time.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  size="xl"
                  className="px-8"
                  render={
                    <Link href="/register">
                      Sign up free{" "}
                      <Image
                        src="/images/icons/heart.png"
                        alt=""
                        width={16}
                        height={16}
                        className="inline-block size-4 align-[-2px]"
                      />
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  size="xl"
                  className="px-8"
                  render={<Link href="/login">Log in</Link>}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center justify-center -space-x-8 py-4">
                <MoodPolaroid
                  mood="HAPPY"
                  date="Sep 18"
                  note="Coffee with Lam, sunny day"
                  rotate="left"
                  className="w-32 sm:w-36"
                />
                <MoodPolaroid
                  mood="VERY_HAPPY"
                  date="Sep 20"
                  note="Finished my painting!"
                  rotate="none"
                  className="z-10 w-36 shadow-lg sm:w-44"
                />
                <MoodPolaroid
                  mood="NEUTRAL"
                  date="Sep 21"
                  note="Quiet day, read a book"
                  rotate="right"
                  className="w-32 sm:w-36"
                />
              </div>
            </div>
          </section>

          {/* How it works */}
          <section aria-label="How it works" className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="flex items-center justify-center gap-2 font-heading text-2xl text-foreground sm:text-3xl">
                Three little steps
                <Image
                  src="/images/icons/heart.png"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                />
              </h2>
              <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                No streaks to keep up, no pressure — just a small, honest
                check-in whenever you like.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="relative flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface/60 px-5 py-6 text-center"
                >
                  <span className="absolute -top-3 -left-3 flex size-7 items-center justify-center rounded-full bg-primary font-heading text-sm text-primary-foreground shadow-sm">
                    {index + 1}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary-hover">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-heading text-lg text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
