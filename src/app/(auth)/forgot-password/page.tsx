import type { Metadata } from "next";
import { AuthCenteredLayout } from "@/components/auth/auth-layouts";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCenteredLayout>
      <ForgotPasswordForm />
    </AuthCenteredLayout>
  );
}
