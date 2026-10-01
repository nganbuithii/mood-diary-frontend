"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "cn";

import { useThemePreference } from "@/lib/hooks/use-theme-preference";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match my device", icon: Monitor },
];

export function ThemeSwitcher() {
  const [preference, setPreference] = useThemePreference();

  return (
    <div role="radiogroup" aria-label="Theme" className="flex shrink-0 gap-0.5 rounded-full bg-muted p-0.5">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isSelected = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            title={label}
            onClick={() => setPreference(value)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              isSelected
                ? "bg-surface text-primary-hover shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon aria-hidden className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
