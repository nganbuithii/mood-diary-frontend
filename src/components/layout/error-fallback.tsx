"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ErrorFallback({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[60svh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-heading text-2xl text-foreground">♡ Oops, this page tripped over</span>
      <p className="max-w-sm text-sm text-muted-foreground">
        Something went wrong while showing this page. Your diary is safe, so give it another try.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button className="rounded-full" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" className="rounded-full" render={<Link href="/home">Back home</Link>} />
      </div>
    </div>
  );
}
