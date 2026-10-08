"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, KeyRound, LogOut, User } from "lucide-react";
import { cn } from "cn";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

const ITEM_CLASS =
  "flex w-full cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none select-none data-highlighted:bg-primary/10 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

export function UserMenu() {
  const { data: currentUser } = useCurrentUser();
  const { signOut, isSigningOut } = useSignOut();
  const initial = currentUser?.displayName.charAt(0).toUpperCase();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Your account"
        className="group flex shrink-0 items-center gap-2.5 rounded-xl py-1 pr-1 pl-1.5 transition-colors outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-primary/5 lg:pr-2"
      >
        <span className="relative rotate-3 rounded-[5px] border border-foreground/15 bg-surface p-[3px] pb-[8px] shadow-[0_1.5px_0_var(--color-border)] transition-transform duration-200 group-hover:rotate-0 group-data-popup-open:rotate-0 motion-reduce:transition-none">
          <span
            aria-hidden
            className="absolute -top-1.5 left-1/2 z-10 h-2.5 w-6 -translate-x-1/2 -rotate-6 rounded-[1px] bg-secondary/70"
          />
          <span className="flex size-8 items-center justify-center overflow-hidden rounded-[3px] bg-primary/25 font-heading text-lg text-foreground">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              (initial ?? <User className="size-4" />)
            )}
          </span>
        </span>
        {currentUser && (
          <span className="hidden max-w-28 truncate text-sm font-semibold text-foreground lg:inline">
            {currentUser.displayName}
          </span>
        )}
        <ChevronDown
          aria-hidden
          className="hidden size-3.5 text-muted-foreground transition-transform group-data-popup-open:rotate-180 lg:block"
        />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Menu.Popup
            className={cn(
              "w-60 origin-(--transform-origin) rounded-2xl border border-border bg-surface p-1.5 shadow-lg outline-none",
              "transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            )}
          >
            {currentUser && (
              <div className="flex flex-col px-2.5 pt-1.5 pb-2">
                <span className="truncate font-heading text-lg leading-tight text-foreground">
                  {currentUser.displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
              </div>
            )}
            <Menu.Separator className="mx-1 my-1 h-px border-t border-dashed border-border" />

            <Menu.LinkItem render={<Link href="/profile" />} className={ITEM_CLASS}>
              <User /> Profile & settings
            </Menu.LinkItem>
            <Menu.LinkItem render={<Link href="/change-password" />} className={ITEM_CLASS}>
              <KeyRound /> Change password
            </Menu.LinkItem>

            <Menu.Separator className="mx-1 my-1 h-px border-t border-dashed border-border" />

            <Menu.Item
              disabled={isSigningOut}
              onClick={signOut}
              className={cn(ITEM_CLASS, "text-destructive data-highlighted:bg-destructive/10 [&_svg]:text-destructive")}
            >
              <LogOut /> {isSigningOut ? "Logging out..." : "Log out"}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
