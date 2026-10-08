import { useSyncExternalStore } from "react";

import {
  getThemePreference,
  setThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from "@/lib/theme";

export function useThemePreference() {
  const preference = useSyncExternalStore<ThemePreference>(
    subscribeToThemePreference,
    getThemePreference,
    () => "system",
  );

  return [preference, setThemePreference] as const;
}
