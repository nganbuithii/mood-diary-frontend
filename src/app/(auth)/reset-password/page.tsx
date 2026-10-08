import type { Metadata } from "next";

import { AuthCenteredLayout } from "@/components/auth/auth-layouts";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthCenteredLayout>
      <ResetPasswordForm token={typeof token === "string" && token ? token : undefined} />
    </AuthCenteredLayout>
  );
}
