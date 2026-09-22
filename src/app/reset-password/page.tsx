import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[url('/images/bg_home.png')] bg-contain bg-top bg-no-repeat px-6 py-10 lg:bg-cover lg:bg-center lg:bg-fixed">
      <div className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-accent-blue/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-secondary/20 blur-3xl"
        />

        <div className="relative z-10 w-full">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
