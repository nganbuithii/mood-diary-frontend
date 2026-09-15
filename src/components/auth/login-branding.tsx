import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";

export function LoginBranding() {
  return (
    <AuthBrandingPanel className="bg-secondary/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-accent-blue/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-28 size-80 rounded-full bg-secondary/25 blur-3xl"
      />

      {/* top-left: scrapbook tape */}
      <span
        aria-hidden
        className="absolute top-12 left-12 h-6 w-24 -rotate-6 rounded-sm bg-accent-blue/50 shadow-sm"
      />
      {/* top-right: doodle pair */}
      <span
        aria-hidden
        className="absolute top-10 right-16 rotate-12 text-2xl text-secondary"
      >
        ✦
      </span>
      <span
        aria-hidden
        className="absolute top-20 right-28 -rotate-12 text-lg text-primary/70"
      >
        ♡
      </span>

      {/* bottom-left: handwritten sticky note */}
      <div
        aria-hidden
        className="absolute bottom-24 left-14 w-40 -rotate-2 rounded-sm border border-border bg-surface px-3 py-2.5 shadow-sm"
      >
        <span className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-1 rounded-[2px] bg-accent-green/50" />
        <p className="font-heading text-base text-foreground">
          How was your day? <span aria-hidden>♡</span>
        </p>
      </div>

      {/* bottom-right: mini polaroid */}
      <div
        aria-hidden
        className="absolute right-16 bottom-20 flex w-28 rotate-3 flex-col items-center gap-2 rounded-md border border-border bg-surface p-2 pb-3 shadow-sm"
      >
        <div className="flex h-16 w-full items-center justify-center rounded-sm bg-mood-happy/60 text-2xl">
          🌷
        </div>
        <span className="font-heading text-sm text-foreground">happy ♡</span>
      </div>

      <div className="relative z-10 flex max-w-md flex-col gap-4">
        <span className="font-heading text-5xl leading-tight text-foreground">
          Mood Diary <span aria-hidden>♡</span>
        </span>
        <p className="text-base text-muted-foreground">
          A cozy corner to jot down how today felt — one little page at a
          time.
        </p>
      </div>
    </AuthBrandingPanel>
  );
}
