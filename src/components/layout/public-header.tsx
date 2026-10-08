import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-dashed border-primary/30 bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Mood Diary home"
          className="group shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo />
        </Link>

        <nav aria-label="Account" className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <Button variant="ghost" className="rounded-full max-sm:px-2" render={<Link href="/login">Log in</Link>} />
          <Button className="rounded-full px-4 max-sm:px-3" render={<Link href="/register">Sign up free</Link>} />
        </nav>
      </div>
    </header>
  );
}
