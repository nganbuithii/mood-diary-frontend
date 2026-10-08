"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, Mail } from "lucide-react";
import { cn } from "cn";

import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { formatDate, formatDateKey } from "@/lib/date";
import { useMoodStreak } from "@/features/diary/hooks/use-mood-streak";
import { useReadyLetterCount } from "@/features/letters/hooks/use-letters";
import { useToday } from "@/lib/hooks/use-today";
import { pluralize } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/diary", label: "My Diary" },
  { href: "/memories", label: "Memories" },
  { href: "/insights", label: "Insights" },
] as const;

const TOP_ICON_CLASS =
  "relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-primary/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50";
const TOP_ICON_ACTIVE_CLASS = "bg-primary/15 text-primary-hover hover:text-primary-hover";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const today = useToday();
  const isFavoritesPage = pathname === "/favorites";

  return (
    <header className="sticky top-0 z-20 border-b-[1.5px] border-dashed border-primary/50 bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="border-b border-border/30">
        <div className="mx-auto flex h-9 w-full max-w-6xl items-center gap-4 px-4 text-xs sm:px-6 lg:px-10">
          <time dateTime={formatDateKey(today)} className="hidden font-semibold text-muted-foreground sm:inline">
            {formatDate(today, "weekdayMonthDay")}
          </time>
          <StreakLink today={today} />

          <div className="ml-auto flex items-center gap-0.5">
            <LetterboxLink />
            <Link
              href="/favorites"
              title="Favorites"
              aria-label="Favorites"
              aria-current={isFavoritesPage ? "page" : undefined}
              className={cn(TOP_ICON_CLASS, isFavoritesPage && TOP_ICON_ACTIVE_CLASS)}
            >
              <Heart className="size-4" fill={isFavoritesPage ? "currentColor" : "none"} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-4 sm:px-6 lg:px-10">
        <Link
          href="/home"
          aria-label="Mood Diary home"
          className="group shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Logo className="[&_svg]:size-10" wordmarkClassName="text-[1.9rem]" />
        </Link>

        <NavTabs className="hidden md:flex" />

        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-2 sm:px-6 md:hidden">
        <NavTabs className="flex justify-between" />
      </div>
    </header>
  );
}

function StreakLink({ today }: { today: Date }) {
  const { data: streak } = useMoodStreak(formatDateKey(today));
  if (!streak) return null;

  const { current, writtenToday } = streak;
  const text = current > 0 ? `${current}-day streak` : "Start a streak today";
  const label =
    current > 0 && !writtenToday ? `${text} — write today to keep it going` : text;

  return (
    <Link
      href="/home"
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50",
        writtenToday ? "text-primary-hover" : "text-muted-foreground",
      )}
    >
      <Flame className="size-3.5" fill={writtenToday ? "currentColor" : "none"} />
      {text}
    </Link>
  );
}

function LetterboxLink() {
  const pathname = usePathname();
  const readyCount = useReadyLetterCount();
  const isActive = isActivePath(pathname, "/letters");
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
      className={cn(TOP_ICON_CLASS, isActive && TOP_ICON_ACTIVE_CLASS)}
    >
      <Mail className="size-4" />
      {readyCount > 0 && (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary-hover px-1 text-[0.6rem] leading-none font-bold text-primary-foreground ring-2 ring-surface"
        >
          {readyCount}
        </span>
      )}
    </Link>
  );
}

function NavTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("items-center gap-5 lg:gap-7", className)}>
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-sm px-1 font-heading text-xl leading-none whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:text-[1.35rem]",
              isActive
                ? "bg-[linear-gradient(to_bottom,transparent_58%,color-mix(in_oklab,var(--color-primary)_55%,transparent)_58%_92%,transparent_92%)] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
