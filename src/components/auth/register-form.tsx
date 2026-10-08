"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock, Mail, User } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { TextField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { PasswordField } from "@/components/auth/password-input";
import { RetroWindow } from "@/components/mood-diary/retro-window";
import { useRegister } from "@/features/auth/hooks/use-register";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { ApiError, getErrorMessage } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

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
      if (error instanceof ApiError && error.status === HTTP_STATUS.CONFLICT) {
        setError("email", { message: error.message });
        return;
      }

      setError("root", {
        message: getErrorMessage(error, "Something went wrong. Please try again."),
      });
    }
  });

  return (
    <RetroWindow title="Create Your Account" accent className="w-full">
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <TextField
            id="displayName"
            label="Display name"
            icon={<User />}
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            disabled={isSubmitting}
            error={errors.displayName}
            {...register("displayName")}
          />

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
            icon={<Lock />}
            placeholder="Enter your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password}
            {...register("password")}
          />

          <PasswordField
            id="confirm-password"
            label="Confirm password"
            icon={<Lock />}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.confirmPassword}
            {...register("confirmPassword")}
          />

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
            <SubmitButton isPending={isSubmitting} pendingLabel="Creating account...">
              Create account
            </SubmitButton>
          </Field>

          <FieldSeparator>or</FieldSeparator>

          <Field>
            <GoogleAuthButton />
            <FieldDescription className="text-center">
              Already have an account?{" "}
              <Link href="/login">Log in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </RetroWindow>
  );
}
