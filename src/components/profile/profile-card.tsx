"use client";

import {
  BellRing,
  CalendarDays,
  Download,
  KeyRound,
  Laptop,
  Mail,
  Moon,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { LogoutButton } from "@/components/auth/logout-button";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { SettingRow } from "@/components/profile/setting-row";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

function formatMemberSince(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileCard() {
  const { data: currentUser, isPending } = useCurrentUser();

  if (isPending || !currentUser) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
          <Spinner size="lg" />
          Loading your page...
        </CardContent>
      </Card>
    );
  }

  const initial = currentUser.displayName.charAt(0).toUpperCase();

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Cover + avatar */}
      <Card className="overflow-visible py-0">
        <div
          aria-hidden
          className="h-20 rounded-t-xl bg-linear-to-r from-primary/30 via-secondary/30 to-accent-blue/30 sm:h-24"
        />
        <div className="flex flex-col items-center gap-1 px-6 pt-0 pb-6 text-center">
          <div className="-mt-14 sm:-mt-16">
            <AvatarUpload initial={initial} size="lg" />
          </div>
          <p className="mt-2 font-heading text-2xl text-foreground">
            {currentUser.displayName} <span aria-hidden>♡</span>
          </p>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </div>
      </Card>

      {/* Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-blue/30 text-primary-hover">
              <Mail className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <CardDescription>Email</CardDescription>
              <span className="text-sm font-medium text-foreground">
                {currentUser.email}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-green/30 text-primary-hover">
              <CalendarDays className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <CardDescription>Member since</CardDescription>
              <span className="text-sm font-medium text-foreground">
                {formatMemberSince(currentUser.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account & security */}
      <Card>
        <CardHeader>
          <CardTitle>Account & Security</CardTitle>
          <CardDescription>Manage your login and session.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <SettingRow
            icon={KeyRound}
            title="Change password"
            description="Update the password you log in with"
            tint="bg-accent-blue/30"
            href="/change-password"
          />
          <SettingRow
            icon={ShieldCheck}
            title="Two-factor authentication"
            description="Add an extra layer of security at login"
            tint="bg-accent-green/30"
            comingSoon
          />
          <SettingRow
            icon={Laptop}
            title="Active sessions"
            description="See and sign out devices logged into your account"
            tint="bg-secondary/40"
            comingSoon
          />
          <SettingRow
            icon={Trash2}
            title="Delete account"
            description="Permanently remove your account and diary entries"
            tint="bg-destructive/15"
            comingSoon
          />

          <Separator className="my-4" />

          <LogoutButton variant="destructive" size="default" className="w-full" />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Shape how Moodiary feels for you.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <SettingRow
            icon={BellRing}
            title="Daily check-in reminder"
            description="A gentle nudge to log how you're feeling"
            tint="bg-mood-happy/40"
            comingSoon
          />
          <SettingRow
            icon={Moon}
            title="Dark mode"
            description="Easier on the eyes for late-night entries"
            tint="bg-mood-very-happy/40"
            comingSoon
          />
          <SettingRow
            icon={Download}
            title="Export my diary"
            description="Download all your entries as a keepsake"
            tint="bg-mood-neutral/50"
            comingSoon
          />
        </CardContent>
      </Card>
    </div>
  );
}
