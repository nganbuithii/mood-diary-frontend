import { Navbar } from "@/components/layout/navbar";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="flex w-full items-center justify-center px-6 py-10 sm:py-16">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
