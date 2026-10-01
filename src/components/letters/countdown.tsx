import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

const UNITS = [
  { label: "days", ms: 86_400_000 },
  { label: "hours", ms: 3_600_000 },
  { label: "minutes", ms: 60_000 },
  { label: "seconds", ms: 1_000 },
] as const;

function splitRemaining(ms: number) {
  let rest = Math.max(0, ms);
  return UNITS.map((unit) => {
    const value = Math.floor(rest / unit.ms);
    rest -= value * unit.ms;
    return { label: unit.label, value };
  });
}

export function useNow(intervalMs = 1_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

interface CountdownProps {
  target: string;
  now: Date;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({ target, now, onComplete, className }: CountdownProps) {
  const remaining = new Date(target).getTime() - now.getTime();
  const parts = splitRemaining(remaining);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (remaining > 0 || hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete?.();
  }, [remaining, onComplete]);

  const [days, hours, minutes] = parts;
  const spoken = `${days.value} days, ${hours.value} hours and ${minutes.value} minutes until it opens`;

  return (
    <div role="timer" aria-label={spoken} className={cn("grid grid-cols-4 gap-2 sm:gap-3", className)}>
      {parts.map((part, index) => (
        <div
          key={part.label}
          aria-hidden
          className="relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl bg-surface px-1 py-3 shadow-sm ring-1 ring-foreground/5 sm:py-4"
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-foreground/5" />
          <span
            key={index === parts.length - 1 ? part.value : undefined}
            className={cn(
              "font-heading text-3xl leading-none text-foreground tabular-nums sm:text-4xl",
              index === parts.length - 1 && "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-300",
            )}
          >
            {index === 0 ? part.value : String(part.value).padStart(2, "0")}
          </span>
          <span className="text-[11px] tracking-wider text-muted-foreground uppercase">{part.label}</span>
        </div>
      ))}
    </div>
  );
}
