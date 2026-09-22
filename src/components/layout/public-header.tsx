import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 font-heading text-xl text-foreground sm:text-2xl"
        >
          <span aria-hidden>🌷</span> Moodiary
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login">Log in</Link>}
          />
          <Button size="sm" render={<Link href="/register">Sign up</Link>} />
        </div>
      </div>
    </header>
  );
}
