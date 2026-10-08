import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-layouts";
import { GuestOnly } from "@/components/auth/guest-only";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      tagline="Your little corner for moods & memories"
      mobileSubtitle="Start your little diary in a few seconds."
      formColumnClassName="lg:grid-cols-[1fr_minmax(440px,500px)]"
    >
      <GuestOnly>
        <RegisterForm />
      </GuestOnly>
    </AuthSplitLayout>
  );
}
