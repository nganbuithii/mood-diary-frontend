import Link from "next/link";
import { Images, NotebookPen, Smile, Users } from "lucide-react";

import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: Smile,
    title: "Quick mood check-ins",
    description:
      "Log how you feel in seconds with a simple, colorful mood picker.",
  },
  {
    icon: NotebookPen,
    title: "Little diary entries",
    description:
      "Jot down a note about your day, right alongside your mood.",
  },
  {
    icon: Images,
    title: "Your memories, saved",
    description: "Revisit past days anytime and watch your story unfold.",
  },
  {
    icon: Users,
    title: "Share with friends",
    description:
      "Keep close friends in the loop and cheer each other on.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <PublicHeader />

      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-accent-blue/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-secondary/15 blur-3xl"
        />

        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <section className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <h1 className="font-heading text-4xl text-foreground sm:text-5xl">
              A cozy little home for your everyday feelings{" "}
              <span aria-hidden>♡</span>
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Check in with how you feel, save the small moments, and look
              back on your story — one gentle page at a time.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="px-8"
                render={<Link href="/register">Sign up free ♡</Link>}
              />
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                render={<Link href="/login">Log in</Link>}
              />
            </div>
          </section>

          <section
            aria-label="Features"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <span className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary-hover">
                    <Icon className="size-4.5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </section>
        </main>

        <footer className="relative border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Made with <span aria-hidden>♡</span> for your feelings — Moodiary.
        </footer>
      </div>
    </div>
  );
}
