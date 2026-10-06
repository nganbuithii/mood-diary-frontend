import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center px-6 py-10">
      <EmptyState
        className="w-full max-w-md"
        title="This page wandered off ♡"
        description="The link may be old or mistyped. Let's get you back to your diary."
        action={<Button className="rounded-full" render={<Link href="/home">Back to my diary</Link>} />}
      />
    </main>
  );
}
