import { useEffect, useState } from "react";

function msUntilTomorrow(now: Date) {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getTime() - now.getTime();
}

export function useToday() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const refresh = () =>
      setToday((current) => {
        const now = new Date();
        return now.toDateString() === current.toDateString() ? current : now;
      });
    const onVisibilityChange = () => document.visibilityState === "visible" && refresh();

    const timer = setTimeout(refresh, msUntilTomorrow(today) + 1000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", refresh);
    };
  }, [today]);

  return today;
}
