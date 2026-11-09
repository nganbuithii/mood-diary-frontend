import { AuthGate } from "@/components/auth/auth-gate";
import { Navbar } from "@/components/layout/navbar";
import { ServerWakeUpGate } from "@/components/layout/server-wake-up-gate";
import { AchievementUnlockWatcher } from "@/components/achievements/achievement-unlock-watcher";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServerWakeUpGate>
      <AuthGate>
        <div className="min-h-svh">
          <Navbar />
          {children}
          <AchievementUnlockWatcher />
        </div>
      </AuthGate>
    </ServerWakeUpGate>
  );
}
