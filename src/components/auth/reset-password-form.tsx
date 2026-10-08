"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard, AuthResultPanel } from "@/components/auth/auth-card";
import { PasswordField } from "@/components/auth/password-input";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/reset-password.schema";
import { ApiError, getErrorMessage } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

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
    resetPasswordMutation.error.status === HTTP_STATUS.UNAUTHORIZED;

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.newPassword,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) return;

      setError("root", {
        message: getErrorMessage(error, "Something went wrong. Please try again."),
      });
    }
  });

  if (!token || isTokenRejected) {
    return (
      <AuthResultPanel
        windowTitle="Link Expired"
        emoji="🥀"
        title="This link doesn't work anymore"
        description={
          <>
            Reset links can only be used once and expire after a while. Request a new one and we&apos;ll
            send it right over <span aria-hidden>♡</span>
          </>
        }
      >
        <Button className="w-full" render={<Link href="/forgot-password">Send a new link</Link>} />
      </AuthResultPanel>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <AuthResultPanel
        windowTitle="Password Reset"
        title={
          <>
            All set <span aria-hidden>♡</span>
          </>
        }
        description="Your password was reset. For your safety, you've been logged out everywhere — please log in with your new password."
      >
        <Button className="w-full" render={<Link href="/login">Go to login</Link>} />
      </AuthResultPanel>
    );
  }

  return (
    <AuthCard
      windowTitle="Reset Password"
      title="Choose a new password"
      description="Resetting your password will log you out on all devices."
    >
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <PasswordField
            id="newPassword"
            label="New password"
            icon={<KeyRound />}
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.newPassword}
            {...register("newPassword")}
          />

          <PasswordField
            id="confirmNewPassword"
            label="Confirm new password"
            icon={<KeyRound />}
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.confirmNewPassword}
            {...register("confirmNewPassword")}
          />

          <FieldError errors={[errors.root]} />

          <Field>
            <SubmitButton isPending={isSubmitting} pendingLabel="Resetting...">
              Reset password
            </SubmitButton>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
