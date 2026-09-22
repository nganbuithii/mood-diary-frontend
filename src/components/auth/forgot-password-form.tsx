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
import { ApiError } from "@/lib/api/http-error";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = forgotPasswordMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
      await forgotPasswordMutation.mutateAsync(values);
  });

  if (forgotPasswordMutation.isSuccess) {
    return (
      <RetroWindow title="Check Your Email" accent className="w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <CardTitle className="text-xl">
            Reset link sent <span aria-hidden>♡</span>
          </CardTitle>
          <CardDescription>
            If an account exists for that email, we&apos;ve sent a link to
            reset your password. It should arrive in a few minutes.
          </CardDescription>
          <Button
            className="w-full"
            render={<Link href="/login">Back to login</Link>}
          />
        </div>
      </RetroWindow>
    );
  }

  return (
    <RetroWindow title="Forgot Password" accent className="w-full">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          Forgot your password? <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>
          No worries — enter your email and we&apos;ll send you a link to
          reset it.
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
          </Field>

          <FieldDescription className="text-center">
            Remembered it after all? <Link href="/login">Log in</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
