import { AuthGate } from "@/components/auth/auth-gate";
import { Navbar } from "@/components/layout/navbar";
import { ServerWakeUpGate } from "@/components/layout/server-wake-up-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerWakeUpGate>
      <AuthGate>
        <div className="min-h-svh">
          <Navbar />
          {children}
        </div>
      </AuthGate>
    </ServerWakeUpGate>
  );
}
