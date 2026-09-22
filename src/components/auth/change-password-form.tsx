"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, Lock } from "lucide-react";

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
import { useChangePassword } from "@/features/auth/hooks/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/change-password.schema";
import { ApiError } from "@/lib/api/http-error";

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const isSubmitting = changePasswordMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("currentPassword", {
          message: error.message || "Current password is incorrect.",
        });
        return;
      }

      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  });

  if (changePasswordMutation.isSuccess) {
    return (
      <RetroWindow title="Password Changed" className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <CardTitle className="text-xl">
            All set <span aria-hidden>♡</span>
          </CardTitle>
          <CardDescription>
            Your password was changed. For your safety, you&apos;ve been
            logged out everywhere — please log in again.
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
    <RetroWindow title="Change Password" className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Update your password <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          Changing your password will log you out on all devices.
        </CardDescription>
      </div>
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.currentPassword}>
            <FieldLabel htmlFor="currentPassword">
              Current password
            </FieldLabel>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              icon={<Lock />}
              disabled={isSubmitting}
              aria-invalid={!!errors.currentPassword}
              aria-describedby={
                errors.currentPassword ? "currentPassword-error" : undefined
              }
              {...register("currentPassword")}
            />
            <FieldError
              id="currentPassword-error"
              errors={[errors.currentPassword]}
            />
          </Field>

          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">New password</FieldLabel>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              icon={<KeyRound />}
              disabled={isSubmitting}
              aria-invalid={!!errors.newPassword}
              aria-describedby={
                errors.newPassword ? "newPassword-error" : "newPassword-description"
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
              {isSubmitting ? "Updating..." : "Update password ♡"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
