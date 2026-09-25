"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookHeart, Flame, Heart, House, Images, User, Users } from "lucide-react";
import { cn } from "cn";

import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const NAV_LINKS = [
  { href: "/home", label: "Home", icon: House },
  { href: "/diary", label: "My Diary", icon: BookHeart },
  { href: "/memories", label: "Memories", icon: Images },
  { href: "/friends", label: "Friends", icon: Users },
] as const;

const ICON_BUTTON_CLASS =
  "flex size-9 items-center justify-center rounded-full transition-colors sm:size-10";

export function Navbar() {
  const { data: currentUser } = useCurrentUser();
  const initial = currentUser?.displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-dashed border-primary/30 bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-10">
        <Link href="/home" className="shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <Image
            src="/images/logo.png"
            alt="Moodiary"
            width={612}
            height={408}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <NavTabs className="mx-auto hidden md:flex" />

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          <button
            type="button"
            disabled
            title="Daily streak — coming soon"
            aria-label="Daily streak — coming soon"
            className={cn(ICON_BUTTON_CLASS, "hidden text-muted-foreground/60 sm:flex")}
          >
            <Flame className="size-5" />
          </button>

          <button
            type="button"
            disabled
            title="Notifications — coming soon"
            aria-label="Notifications — coming soon"
            className={cn(ICON_BUTTON_CLASS, "hidden text-muted-foreground/60 sm:flex")}
          >
            <Bell className="size-5" />
          </button>

          <Link
            href="/favorites"
            aria-label="Favorites"
            className={cn(ICON_BUTTON_CLASS, "text-primary-hover hover:bg-primary/10")}
          >
            <Heart className="size-5" fill="currentColor" />
          </Link>

          <Link
            href="/profile"
            aria-label="Your profile"
            className="flex shrink-0 items-center gap-2 rounded-full p-0.5 transition-colors outline-none hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring/50 lg:pr-3"
          >
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary/20 font-heading text-base text-foreground ring-2 ring-primary/50 ring-offset-2 ring-offset-surface sm:size-10">
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="" className="size-full object-cover" />
              ) : (
                (initial ?? <User className="size-5" />)
              )}
            </span>
            {currentUser && (
              <span className="hidden max-w-32 truncate font-heading text-base text-foreground lg:inline">
                {currentUser.displayName}
              </span>
            )}
          </Link>

          <LogoutButton size="icon" showLabel={false} className="rounded-full text-muted-foreground" />
        </div>
      </div>

      <div className="px-4 pb-2.5 sm:px-6 md:hidden">
        <NavTabs className="flex w-full" />
      </div>
    </header>
  );
}

function NavTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className={cn(
        "items-center gap-1 rounded-full bg-primary/10 p-1",
        className,
      )}
    >
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs whitespace-nowrap text-muted-foreground transition-all outline-none hover:bg-surface/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 sm:px-4 sm:text-sm",
              isActive && "bg-surface font-medium text-foreground shadow-sm hover:bg-surface",
            )}
          >
            <Icon
              aria-hidden
              className={cn("size-4 shrink-0", isActive && "text-primary-hover")}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
