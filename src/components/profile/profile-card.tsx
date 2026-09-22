"use client";

import Link from "next/link";
import { CalendarDays, KeyRound, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/auth/logout-button";
import { RetroWindow } from "@/components/mood-diary/retro-window";
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
      <RetroWindow title="My Profile" className="w-full max-w-sm">
        <p className="text-center text-sm text-muted-foreground">
          Loading your page...
        </p>
      </RetroWindow>
    );
  }

  const initial = currentUser.displayName.charAt(0).toUpperCase();

  return (
    <RetroWindow title="My Profile" className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/20 font-heading text-2xl text-foreground">
          {initial}
        </span>
        <p className="font-heading text-xl text-foreground">
          {currentUser.displayName} <span aria-hidden>♡</span>
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="size-4 shrink-0" />
          <span>{currentUser.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <span>Member since {formatMemberSince(currentUser.createdAt)}</span>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          render={
            <Link href="/change-password">
              <KeyRound className="size-4" />
              Change password
            </Link>
          }
        />
        <LogoutButton variant="outline" size="default" className="w-full" />
      </div>
    </RetroWindow>
  );
}
