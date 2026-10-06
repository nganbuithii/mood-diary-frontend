const LOGIN_PATH = "/login";
const DEFAULT_AFTER_LOGIN_PATH = "/home";
const GUEST_ONLY_PATHS = [LOGIN_PATH, "/register"];
const PLACEHOLDER_ORIGIN = "http://placeholder.invalid";

export function loginPathFor(returnTo: string) {
  return `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}`;
}

export function currentLocationPath() {
  return window.location.pathname + window.location.search;
}

export function safeReturnPath(value: string | string[] | undefined) {
  if (typeof value !== "string" || !value.startsWith("/")) return DEFAULT_AFTER_LOGIN_PATH;

  const url = new URL(value, PLACEHOLDER_ORIGIN);
  if (url.origin !== PLACEHOLDER_ORIGIN || GUEST_ONLY_PATHS.includes(url.pathname)) {
    return DEFAULT_AFTER_LOGIN_PATH;
  }
  return url.pathname + url.search + url.hash;
}
