import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "cn";

const WIDTH = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  wide: "max-w-6xl lg:px-10",
} as const;

interface PageShellProps {
  width?: keyof typeof WIDTH;
  glows?: [string, string?];
  className?: string;
  children: React.ReactNode;
}

function PageShell({ width = "wide", glows = ["bg-primary/20"], className, children }: PageShellProps) {
  const [topGlow, bottomGlow] = glows;
  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className={cn("pointer-events-none absolute -top-24 right-[-10%] size-72 rounded-full blur-3xl", topGlow)}
      />
      {bottomGlow && (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute bottom-0 left-[-10%] size-72 rounded-full blur-3xl", bottomGlow)}
        />
      )}
      <main className={cn("relative mx-auto flex w-full flex-col gap-8 px-4 py-8 sm:px-6", WIDTH[width], className)}>
        {children}
      </main>
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className="w-fit -rotate-2 rounded-full bg-surface/80 px-3 py-0.5 font-heading text-sm text-primary-hover shadow-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="font-heading text-3xl text-foreground sm:text-4xl">{title}</h1>
        {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2 self-start sm:self-auto">{actions}</div>}
    </header>
  );
}

function PageSection({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-heading text-xl text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex w-fit items-center gap-1.5 rounded-full text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <ArrowLeft aria-hidden className="size-4" /> {children}
    </Link>
  );
}

export { BackLink, PageHeader, PageSection, PageShell };
