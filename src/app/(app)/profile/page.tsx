import type { Metadata } from "next";
import { ProfileCard } from "@/components/profile/profile-card";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <div className="w-full px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <ProfileCard />
      </div>
    </div>
  );
}
