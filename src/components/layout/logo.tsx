import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={cn("size-9", className)}>
      <g transform="rotate(-6 20 21)" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="6" width="23" height="29" rx="5" className="fill-surface stroke-foreground" strokeWidth="2.2" />
        <rect x="12.5" y="6" width="19.5" height="29" rx="4" className="fill-primary/35" />
        {[13, 20.5, 28].map((y) => (
          <circle key={y} cx="9" cy={y} r="2.1" className="fill-surface stroke-foreground" strokeWidth="1.8" />
        ))}
        <path
          d="M22 27.5s-6-3.6-6-7.6a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9c0 4-6 7.6-6 7.6z"
          className="fill-primary-hover stroke-foreground"
          strokeWidth="1.8"
        />
      </g>
      <path
        d="M34.5 4.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"
        className="fill-mood-neutral stroke-foreground"
        strokeWidth="0.9"
      />
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <LogoMark className="shrink-0 transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none" />
      <span className={cn("font-heading text-2xl leading-none whitespace-nowrap text-foreground", wordmarkClassName)}>
        Mood <span className="text-primary-hover">Diary</span>
      </span>
    </span>
  );
}
