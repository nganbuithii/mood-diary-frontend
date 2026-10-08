import type { ReactNode } from "react";
import { cn } from "cn";

import { AuthWelcomeImage } from "@/components/auth/auth-welcome-image";

interface AuthSplitLayoutProps {
  tagline: ReactNode;
  mobileSubtitle: ReactNode;
  formColumnClassName: string;
  children: ReactNode;
}

export function AuthSplitLayout({ tagline, mobileSubtitle, formColumnClassName, children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-6 py-10 lg:px-12 lg:py-16">
      <div className={cn("grid w-full max-w-6xl items-center gap-10 lg:gap-12", formColumnClassName)}>
        <div className="relative hidden flex-col items-center justify-center overflow-hidden px-12 py-16 lg:flex">
          <div className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
            <AuthWelcomeImage />
            <p className="font-heading text-2xl text-foreground">
              {tagline} <span aria-hidden>♡</span>
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex w-full flex-col items-center gap-6 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-accent-blue/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-10 size-64 rounded-full bg-secondary/20 blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-center gap-1 text-center lg:hidden">
            <span className="font-heading text-3xl text-foreground">
              Mood Diary <span aria-hidden>♡</span>
            </span>
            <p className="text-sm text-muted-foreground">{mobileSubtitle}</p>
          </div>
          <div className="relative z-10 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AuthCenteredLayout({ children }: { children: ReactNode }) {
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
      {children}
    </div>
  );
}
