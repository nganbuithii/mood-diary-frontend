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
    // The server can't read localStorage; the real value takes over right after hydration.
    () => "system",
  );

  return [preference, setThemePreference] as const;
}
