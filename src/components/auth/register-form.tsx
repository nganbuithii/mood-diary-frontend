"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { ApiError } from "@/lib/api/http-error";

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = registerMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
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

  return (
    <RetroWindow title="Create Your Account" accent className="w-full">
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.displayName}>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                id="displayName"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                disabled={isSubmitting}
                aria-invalid={!!errors.displayName}
                aria-describedby={
                  errors.displayName ? "displayName-error" : undefined
                }
                {...register("displayName")}
              />
            </InputGroup>
            <FieldError id="displayName-error" errors={[errors.displayName]} />
          </Field>

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
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              icon={<Lock />}
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirm-password">
              Confirm password
            </FieldLabel>
            <PasswordInput
              id="confirm-password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              icon={<Lock />}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              {...register("confirmPassword")}
            />
            <FieldError
              id="confirm-password-error"
              errors={[errors.confirmPassword]}
            />
          </Field>

          {/* Decorative only for now — not required to submit and not sent
              to the API. Backend has no terms-acceptance field yet. */}
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="terms"
              name="terms"
              className="mt-0.5"
              disabled={isSubmitting}
            />
            <FieldLabel
              htmlFor="terms"
              className="block min-w-0 flex-1 font-normal leading-relaxed"
            >
              I agree to the{" "}
              <span className="underline underline-offset-4">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-4">
                Privacy Policy
              </span>
            </FieldLabel>
          </Field>

          <FieldError errors={[errors.root]} />

          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </Field>

          <FieldSeparator>or</FieldSeparator>

          <Field>
            <GoogleAuthButton />
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link href="/login">Log in ♡</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
