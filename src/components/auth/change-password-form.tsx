"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard, AuthResultPanel } from "@/components/auth/auth-card";
import { PasswordField } from "@/components/auth/password-input";
import { useChangePassword } from "@/features/auth/hooks/use-change-password";
import { reloadToLogin } from "@/features/auth/utils/auth-redirect";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/change-password.schema";
import { ApiError, getErrorMessage } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

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
      if (error instanceof ApiError && error.status === HTTP_STATUS.UNAUTHORIZED) {
        setError("currentPassword", {
          message: error.message || "Current password is incorrect.",
        });
        return;
      }

      setError("root", {
        message: getErrorMessage(error, "Something went wrong. Please try again."),
      });
    }
  });

  if (changePasswordMutation.isSuccess) {
    return (
      <AuthResultPanel
        windowTitle="Password Changed"
        title={
          <>
            All set <span aria-hidden>♡</span>
          </>
        }
        description="Your password was changed. For your safety, you've been logged out everywhere — please log in again."
      >
        <Button className="w-full" onClick={reloadToLogin}>
          Go to login
        </Button>
      </AuthResultPanel>
    );
  }

  return (
    <AuthCard
      windowTitle="Change Password"
      title="Update your password"
      description="Changing your password will log you out on all devices."
    >
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <PasswordField
            id="currentPassword"
            label="Current password"
            icon={<Lock />}
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.currentPassword}
            {...register("currentPassword")}
          />

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
            <SubmitButton isPending={isSubmitting} pendingLabel="Updating...">
              Update password
            </SubmitButton>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
