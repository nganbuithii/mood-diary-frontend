"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Flame, Heart, User } from "lucide-react";
import { cn } from "cn";

import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/diary", label: "My Diary" },
  { href: "/memories", label: "Memories" },
  { href: "/friends", label: "Friends" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const initial = currentUser?.displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href="/home"
          className="order-1 flex shrink-0 items-center gap-2 font-heading text-xl text-foreground sm:text-2xl"
        >
          <Image
            src="/images/logo.png"
            alt="Moodiary"
            width={1536}
            height={1024}
            priority
            className="h-11 w-auto shrink-0 sm:h-13"
          />
        </Link>

        <nav
          aria-label="Main"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto md:order-2 md:w-auto md:overflow-visible"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground",
                  isActive && "bg-primary/15 font-medium text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 flex shrink-0 items-center gap-2 md:order-3">
          <button
            type="button"
            disabled
            title="Daily streak — coming soon"
            aria-label="Daily streak — coming soon"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground/70"
          >
            <Flame className="size-5" />
          </button>

          <button
            type="button"
            disabled
            title="Notifications — coming soon"
            aria-label="Notifications — coming soon"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground/70"
          >
            <Bell className="size-5" />
          </button>

          <Link
            href="/favorites"
            aria-label="Favorites"
            className="flex size-10 items-center justify-center rounded-full text-primary-hover transition-colors hover:bg-primary/10"
          >
            <Heart className="size-5" fill="currentColor" />
          </Link>

          <Link
            href="/profile"
            aria-label="Your profile"
            className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-1 pl-2 transition-colors hover:bg-primary/10"
          >
            {currentUser && (
              <span className="hidden font-heading text-sm text-foreground sm:inline">
                {currentUser.displayName}
              </span>
            )}
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 font-heading text-base text-foreground">
              {initial ?? <User className="size-5" />}
            </span>
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
