import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-layouts";
import { GuestOnly } from "@/components/auth/guest-only";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const returnTo = typeof next === "string" ? next : undefined;

  return (
    <AuthSplitLayout
      tagline="A cozy corner to jot down how today felt"
      mobileSubtitle="Log in to keep your little journal going."
      formColumnClassName="lg:grid-cols-[1fr_minmax(380px,440px)]"
    >
      <GuestOnly returnTo={returnTo}>
        <LoginForm returnTo={returnTo} />
      </GuestOnly>
    </AuthSplitLayout>
  );
}
