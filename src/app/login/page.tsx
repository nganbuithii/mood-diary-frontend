import { LoginBranding } from "@/components/auth/login-branding";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <LoginBranding />
      <div className="flex flex-col items-center justify-center gap-6 bg-background px-6 py-10">
        <div className="flex flex-col items-center gap-1 text-center lg:hidden">
          <span className="font-heading text-3xl text-foreground">
            Mood Diary <span aria-hidden>♡</span>
          </span>
          <p className="text-sm text-muted-foreground">
            Log in to keep your little journal going.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
