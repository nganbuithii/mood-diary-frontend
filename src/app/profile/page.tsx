import { Navbar } from "@/components/layout/navbar";
import { ProfileCard } from "@/components/profile/profile-card";

export default function ProfilePage() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <div className="flex w-full items-center justify-center px-6 py-10 sm:py-16">
        <ProfileCard />
      </div>
    </div>
  );
}
