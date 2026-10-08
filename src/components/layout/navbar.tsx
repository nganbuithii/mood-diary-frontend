"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookHeart, ChartPie, Flame, Heart, House, Images, Mail, User } from "lucide-react";
import { cn } from "cn";

import { LogoutButton } from "@/components/auth/logout-button";
import { formatDateKey } from "@/lib/date";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useMoodStreak } from "@/features/diary/hooks/use-mood-streak";
import { useReadyLetterCount } from "@/features/letters/hooks/use-letters";
import { useToday } from "@/lib/hooks/use-today";
import { pluralize } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/home", label: "Home", icon: House },
  { href: "/diary", label: "My Diary", icon: BookHeart },
  { href: "/memories", label: "Memories", icon: Images },
  { href: "/insights", label: "Insights", icon: ChartPie },
] as const;

const ICON_BUTTON_CLASS =
  "flex size-9 items-center justify-center rounded-full transition-colors sm:size-10";

export function Navbar() {
  const { data: currentUser } = useCurrentUser();
  const initial = currentUser?.displayName.charAt(0).toUpperCase();
  const isFavoritesPage = usePathname() === "/favorites";

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
          <StreakBadge />

<LetterboxLink />

          <Link
            href="/favorites"
            aria-label="Favorites"
            aria-current={isFavoritesPage ? "page" : undefined}
            className={cn(
              ICON_BUTTON_CLASS,
              "text-primary-hover hover:bg-primary/10",
              isFavoritesPage && "bg-primary/20 ring-1 ring-primary/50",
            )}
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

function LetterboxLink() {
  const pathname = usePathname();
  const readyCount = useReadyLetterCount();
  const isActive = pathname.startsWith("/letters");
  const label =
    readyCount > 0
      ? `Letterbox, ${pluralize(readyCount, "letter")} ready to open`
      : "Letterbox";

  return (
    <Link
      href="/letters"
      title={label}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        ICON_BUTTON_CLASS,
        "relative text-muted-foreground hover:bg-primary/10 hover:text-foreground",
        isActive && "bg-primary/20 text-foreground ring-1 ring-primary/50",
      )}
    >
      <Mail className="size-5" />
      {readyCount > 0 && (
        <span
          aria-hidden
          className="absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary-hover px-1 text-[0.65rem] leading-4 font-semibold text-primary-foreground ring-2 ring-surface"
        >
          {readyCount}
        </span>
      )}
    </Link>
  );
}

function StreakBadge() {
  const today = useToday();
  const { data: streak } = useMoodStreak(formatDateKey(today));
  const current = streak?.current ?? 0;
  const label = streak
    ? current > 0
      ? `${current}-day streak${streak.writtenToday ? "" : " — write today to keep it going"}`
      : "No streak yet — write today to start one"
    : "Daily streak";

  return (
    <Link
      href="/home"
      title={label}
      aria-label={label}
      className={cn(
        "hidden h-9 items-center gap-1 rounded-full px-2.5 transition-colors hover:bg-primary/10 sm:flex sm:h-10",
        streak?.writtenToday ? "text-primary-hover" : "text-muted-foreground",
      )}
    >
      <Flame className="size-5" fill={streak?.writtenToday ? "currentColor" : "none"} />
      {streak && <span className="font-heading text-base tabular-nums">{current}</span>}
    </Link>
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
