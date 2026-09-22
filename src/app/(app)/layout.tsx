import { Navbar } from "@/components/layout/navbar";

// No "current user" endpoint yet — swap for the real session name once auth exposes one.
const CURRENT_USER_NAME = "Mai";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background">
      <Navbar userName={CURRENT_USER_NAME} />
      {children}
    </div>
  );
}
