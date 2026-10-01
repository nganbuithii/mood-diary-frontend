export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "moodiary-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined into <head> by the root layout. Mirrors applyTheme() but runs before React,
 * so it has to stay plain, dependency-free JavaScript.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var pref = localStorage.getItem("${STORAGE_KEY}");
    var dark = pref === "dark" || (pref !== "light" && window.matchMedia("${DARK_QUERY}").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();`;

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    // Storage can be blocked (private mode, strict cookie settings); fall back to the OS setting.
    return "system";
  }
}

function applyTheme(preference: ThemePreference) {
  const isDark =
    preference === "dark" || (preference === "system" && window.matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle("dark", isDark);
}

const listeners = new Set<() => void>();

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Still switch for this visit even if it can't be remembered.
  }
  applyTheme(preference);
  listeners.forEach((listener) => listener());
}

/** For useSyncExternalStore: follows this tab, other tabs, and the OS setting while on "system". */
export function subscribeToThemePreference(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (getThemePreference() === "system") applyTheme("system");
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    applyTheme(getThemePreference());
    listener();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}
