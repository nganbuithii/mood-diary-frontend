import { Music2 } from "lucide-react";
import { cn } from "cn";

interface SongArtworkProps {
  url: string | null;
  className?: string;
  iconClassName?: string;
}

export function SongArtwork({ url, className, iconClassName }: SongArtworkProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-accent-blue/30 text-foreground shadow-sm",
        className,
      )}
    >
      {url ? <img src={url} alt="" className="size-full object-cover" /> : <Music2 className={cn("size-4", iconClassName)} />}
    </span>
  );
}
