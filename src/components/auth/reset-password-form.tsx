"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
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

function InvalidLink() {
  return (
    <RetroWindow title="Invalid Link" accent className="w-full">
      <div className="flex flex-col items-center gap-4 text-center">
        <CardTitle className="text-xl">
          This link isn&apos;t valid <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          It may have expired, already been used, or been copied
          incorrectly. Request a fresh one below.
        </CardDescription>
        <Button
          className="w-full"
          render={<Link href="/forgot-password">Request a new link</Link>}
        />
      </div>
    </RetroWindow>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const isSubmitting = resetPasswordMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  });

  if (!token) {
    return <InvalidLink />;
  }

  if (resetPasswordMutation.isError) {
    const error = resetPasswordMutation.error;
    if (error instanceof ApiError && error.status === 401) {
      return <InvalidLink />;
    }
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <RetroWindow title="Password Reset" accent className="w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <CardTitle className="text-xl">
            All set <span aria-hidden>♡</span>
          </CardTitle>
          <CardDescription>
            Your password has been reset. You can log in with it now.
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
    <RetroWindow title="Reset Password" accent className="w-full">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Choose a new password <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          Make it something you&apos;ll remember this time.
        </CardDescription>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <PasswordInput
              id="newPassword"
              placeholder="Enter your new password"
              autoComplete="new-password"
              icon={<KeyRound />}
              disabled={isSubmitting}
              aria-invalid={!!errors.newPassword}
              aria-describedby={
                errors.newPassword
                  ? "newPassword-error"
                  : "newPassword-description"
              }
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <FieldError id="newPassword-error" errors={[errors.newPassword]} />
            ) : (
              <FieldDescription id="newPassword-description">
                Use at least 8 characters.
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={!!errors.confirmNewPassword}>
            <FieldLabel htmlFor="confirmNewPassword">
              Confirm new password
            </FieldLabel>
            <PasswordInput
              id="confirmNewPassword"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              icon={<KeyRound />}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmNewPassword}
              aria-describedby={
                errors.confirmNewPassword
                  ? "confirmNewPassword-error"
                  : undefined
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
