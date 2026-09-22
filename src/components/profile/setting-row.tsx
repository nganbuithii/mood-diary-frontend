import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "cn";

interface SettingRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tint: string;
  href?: string;
  comingSoon?: boolean;
}

export function SettingRow({
  icon: Icon,
  title,
  description,
  tint,
  href,
  comingSoon,
}: SettingRowProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-primary-hover",
          tint,
        )}
      >
        <Icon className="size-4.5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="truncate text-xs text-muted-foreground">
          {description}
        </span>
      </div>
      {comingSoon ? (
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Coming soon
        </span>
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const rowClassName =
    "flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-colors";

  if (comingSoon) {
    return (
      <div aria-disabled className={cn(rowClassName, "cursor-default opacity-60")}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href ?? "#"} className={cn(rowClassName, "hover:bg-muted/60")}>
      {content}
    </Link>
  );
}
