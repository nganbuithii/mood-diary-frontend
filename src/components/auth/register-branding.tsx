import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { AuthWelcomeImage } from "@/components/auth/auth-welcome-image";

export function RegisterBranding() {
  return (
    <AuthBrandingPanel className="items-center">
      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
        <AuthWelcomeImage />

        <p className="font-heading text-2xl text-foreground">
          Your little corner for moods &amp; memories{" "}
          <span aria-hidden>♡</span>
        </p>
      </div>
    </AuthBrandingPanel>
  );
}
