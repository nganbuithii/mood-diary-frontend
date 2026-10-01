import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ComposeStepProps {
  number: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function ComposeStep({ number, title, hint, children }: ComposeStepProps) {
  const titleId = `compose-step-${number}`;
  return (
    <Card
      role="group"
      aria-labelledby={titleId}
      className="gap-4 rounded-3xl border-transparent bg-surface/90 py-5 ring-1 ring-foreground/5 sm:py-6"
    >
      <CardHeader className="flex items-center gap-3 px-5 sm:px-6">
        <span
          aria-hidden
          className="flex size-8 shrink-0 -rotate-6 items-center justify-center rounded-full bg-primary font-heading text-base text-primary-foreground shadow-sm"
        >
          {number}
        </span>
        <div className="flex flex-col leading-tight">
          <CardTitle id={titleId} className="text-xl font-normal text-foreground">
            {title}
          </CardTitle>
          {hint && <CardDescription className="text-xs">{hint}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-5 sm:px-6">{children}</CardContent>
    </Card>
  );
}
