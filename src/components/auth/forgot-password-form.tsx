"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard, AuthResultPanel } from "@/components/auth/auth-card";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgot-password.schema";
import { getErrorMessage } from "@/lib/api/http-error";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    reValidateMode: "onBlur",
    defaultValues: { email: "" },
  });

  const isSubmitting = forgotPasswordMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPasswordMutation.mutateAsync(values);
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error, "Something went wrong. Please try again."),
      });
    }
  });

  if (forgotPasswordMutation.isSuccess) {
    return (
      <AuthResultPanel
        windowTitle="Check Your Inbox"
        emoji="💌"
        title={
          <>
            Check your inbox <span aria-hidden>♡</span>
          </>
        }
        description={
          <>
            If an account exists for{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>,
            we&apos;ve sent a link to reset your password.
          </>
        }
      >
        <Button className="w-full" render={<Link href="/login">Back to login</Link>} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => forgotPasswordMutation.reset()}
        >
          Use a different email
        </Button>
      </AuthResultPanel>
    );
  }

  return (
    <AuthCard
      windowTitle="Forgot Password"
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
    >
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

          <FieldError errors={[errors.root]} />

          <Field>
            <SubmitButton isPending={isSubmitting} pendingLabel="Sending...">
              Send reset link
            </SubmitButton>
            <FieldDescription className="text-center">
              Remembered it? <Link href="/login">Back to login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthCard>
  );
}
