import { LoginBranding } from "@/components/auth/login-branding";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-6 py-10 lg:px-12 lg:py-16">
      <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_minmax(380px,440px)] lg:gap-12">
        <LoginBranding />

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
            <p className="text-sm text-muted-foreground">
              Log in to keep your little journal going.
            </p>
          </div>
          <div className="relative z-10 w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
