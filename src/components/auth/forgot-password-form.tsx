"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RetroWindow } from "@/components/mood-diary/retro-window";
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
      <RetroWindow title="Check Your Inbox" className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <span aria-hidden className="text-4xl">💌</span>
          <CardTitle className="text-xl">
            Check your inbox <span aria-hidden>♡</span>
          </CardTitle>
          <CardDescription>
            If an account exists for{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>,
            we&apos;ve sent a link to reset your password.
          </CardDescription>
          <Button
            className="w-full"
            render={<Link href="/login">Back to login</Link>}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => forgotPasswordMutation.reset()}
          >
            Use a different email
          </Button>
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title="Forgot Password" className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Forgot your password? <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset it.
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

          <FieldError errors={[errors.root]} />

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
            <FieldDescription className="text-center">
              Remembered it? <Link href="/login">Back to login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
