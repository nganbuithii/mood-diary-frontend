"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/reset-password.schema";
import { ApiError } from "@/lib/api/http-error";

interface ResetPasswordFormProps {
  token: string | undefined;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const isSubmitting = resetPasswordMutation.isPending;
  const isTokenRejected =
    resetPasswordMutation.error instanceof ApiError &&
    resetPasswordMutation.error.status === 401;

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;

      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  });

  if (!token || isTokenRejected) {
    return (
      <RetroWindow title="Link Expired" className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <span aria-hidden className="text-4xl">🥀</span>
          <CardTitle className="text-xl">This link doesn&apos;t work anymore</CardTitle>
          <CardDescription>
            Reset links can only be used once and expire after a while. Request
            a new one and we&apos;ll send it right over <span aria-hidden>♡</span>
          </CardDescription>
          <Button
            className="w-full"
            render={<Link href="/forgot-password">Send a new link</Link>}
          />
        </div>
      </RetroWindow>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <RetroWindow title="Password Reset" className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <CardTitle className="text-xl">
            All set <span aria-hidden>♡</span>
          </CardTitle>
          <CardDescription>
            Your password was reset. For your safety, you&apos;ve been logged
            out everywhere — please log in with your new password.
          </CardDescription>
          <Button
            className="w-full"
            render={<Link href="/login">Go to login</Link>}
          />
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title="Reset Password" className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Choose a new password <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          Resetting your password will log you out on all devices.
        </CardDescription>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              icon={<KeyRound />}
              disabled={isSubmitting}
              aria-invalid={!!errors.newPassword}
              aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
              {...register("newPassword")}
            />
            <FieldError id="newPassword-error" errors={[errors.newPassword]} />
          </Field>

          <Field data-invalid={!!errors.confirmNewPassword}>
            <FieldLabel htmlFor="confirmNewPassword">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              id="confirmNewPassword"
              autoComplete="new-password"
              icon={<KeyRound />}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmNewPassword}
              aria-describedby={
                errors.confirmNewPassword ? "confirmNewPassword-error" : undefined
              }
              {...register("confirmNewPassword")}
            />
            <FieldError
              id="confirmNewPassword-error"
              errors={[errors.confirmNewPassword]}
            />
          </Field>

          <FieldError errors={[errors.root]} />

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
