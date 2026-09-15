"use client";

import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
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

export function RegisterForm() {
  return (
    <RetroWindow title="Create Your Account" accent className="w-full">
      <form onSubmit={(e) => e.preventDefault()}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Display name</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <User />
              </InputGroupAddon>
              <InputGroupInput
                id="name"
                name="name"
                type="text"
                placeholder="Ngân"
                autoComplete="name"
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              icon={<Lock />}
              required
            />
            <FieldDescription>Use at least 8 characters.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirm password
            </FieldLabel>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              icon={<Lock />}
              required
            />
          </Field>

          <Field orientation="horizontal" className="items-start">
            <Checkbox id="terms" name="terms" className="mt-0.5" />
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

          <Field>
            <Button type="submit" className="w-full">
              Create account ♡
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
