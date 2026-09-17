"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { ApiError } from "@/lib/api/http-error";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = loginMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      router.push("/");
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  });

  return (
    <RetroWindow title="Mood Diary" className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Welcome back <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          Log in to open today&apos;s page in your journal.
        </CardDescription>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </InputGroup>
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={!!errors.password}>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forgot-password"
                className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              icon={<Lock />}
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
            />
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          {/* Decorative only for now — backend login has no remember-me /
              long-lived session option yet. */}
          <Field orientation="horizontal">
            <Checkbox id="remember" name="remember" disabled={isSubmitting} />
            <FieldLabel htmlFor="remember" className="font-normal">
              Remember me
            </FieldLabel>
          </Field>

          <FieldError errors={[errors.root]} />

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in ♡"}
            </Button>
          </Field>

          <FieldSeparator>or</FieldSeparator>

          <Field>
            <GoogleAuthButton />
            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link href="/register">Sign up</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
