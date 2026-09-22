import Image from "next/image";

import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";

export function RegisterBranding() {
  return (
    <AuthBrandingPanel className="items-center">
      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
        <Image
          src="/images/auth/register-welcome.jpg"
          alt=""
          width={736}
          height={414}
          priority
          className="h-auto w-full max-w-md rounded-2xl border border-border shadow-md"
        />

        <p className="font-heading text-2xl text-foreground">
          Your little corner for moods &amp; memories{" "}
          <span aria-hidden>♡</span>
        </p>
      </div>
    </AuthBrandingPanel>
  );
}
