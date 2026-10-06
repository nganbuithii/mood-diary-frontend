import { AuthGate } from "@/components/auth/auth-gate";
import { Navbar } from "@/components/layout/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-svh">
        <Navbar />
        {children}
      </div>
    </AuthGate>
  );
}
