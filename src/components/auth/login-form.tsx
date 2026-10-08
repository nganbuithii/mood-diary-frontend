"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock, Mail } from "lucide-react";

import { Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordField } from "@/components/auth/password-input";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { safeReturnPath } from "@/features/auth/utils/auth-redirect";
import { getErrorMessage } from "@/lib/api/http-error";

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = loginMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      router.replace(safeReturnPath(returnTo));
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error, "Something went wrong. Please try again."),
      });
    }
  });

  return (
    <RetroWindow title="Welcome Back" accent className="w-full">
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <TextField
            id="email"
            label="Email"
            icon={<Mail />}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email}
            {...register("email")}
          />

          <PasswordField
            id="password"
            label="Password"
            labelAction={
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot your password?
              </Link>
            }
            icon={<Lock />}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.password}
            {...register("password")}
          />

          <FieldError errors={[errors.root]} />

          <Field>
            <SubmitButton isPending={isSubmitting} pendingLabel="Logging in...">
              Log in
            </SubmitButton>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link href="/register">Sign up</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
