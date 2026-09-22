import { Navbar } from "@/components/layout/navbar";
import { ProfileCard } from "@/components/profile/profile-card";

export default function ProfilePage() {
  return (
    <div className="min-h-svh">
      <Navbar />
      <div className="w-full px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-2xl">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}
