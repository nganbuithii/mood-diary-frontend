import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export const metadata: Metadata = {
  title: "Change password",
};

export default function ChangePasswordPage() {
  return (
    <div className="flex w-full items-center justify-center px-6 py-10 sm:py-16">
      <ChangePasswordForm />
    </div>
  );
}
