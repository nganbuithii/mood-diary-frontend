import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full bg-accent-blue/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full bg-secondary/15 blur-3xl"
      />
      <ResetPasswordForm token={typeof token === "string" && token ? token : undefined} />
    </div>
  );
}
