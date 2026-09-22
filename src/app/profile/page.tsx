"use client";

import { Navbar } from "@/components/layout/navbar";
import { ProfileCard } from "@/components/profile/profile-card";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function ProfilePage() {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="min-h-svh bg-background">
      <Navbar userName={currentUser?.displayName ?? ""} />
      <div className="flex w-full items-center justify-center px-6 py-10 sm:py-16">
        <ProfileCard />
      </div>
    </div>
  );
}
