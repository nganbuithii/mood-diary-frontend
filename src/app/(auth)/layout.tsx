import { ServerWakeUpGate } from "@/components/layout/server-wake-up-gate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ServerWakeUpGate>{children}</ServerWakeUpGate>;
}
