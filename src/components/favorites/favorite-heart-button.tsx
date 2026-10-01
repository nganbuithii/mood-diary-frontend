"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { useSetDiaryFavorite } from "@/features/diary/hooks/use-set-diary-favorite";

interface FavoriteHeartButtonProps {
  date: string;
  /** Human-readable date used in the accessible label, e.g. "Sep 14". */
  label: string;
  isFavorite: boolean;
  className?: string;
}

export function FavoriteHeartButton({ date, label, isFavorite, className }: FavoriteHeartButtonProps) {
  const { mutate } = useSetDiaryFavorite();

  const toggle = () => {
    const next = !isFavorite;
    mutate(
      { date, isFavorite: next },
      {
        // Unfavoriting is the easy one to do by accident, so give it a way back.
        onSuccess: () => {
          if (next) return;
          toast("Removed from favorites", {
            action: { label: "Undo", onClick: () => mutate({ date, isFavorite: true }) },
          });
        },
      },
    );
  };

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      onClick={toggle}
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur-sm transition-all outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/60 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100",
        isFavorite ? "text-primary-hover" : "text-muted-foreground hover:text-primary-hover",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn("size-4", isFavorite && "motion-safe:animate-in motion-safe:zoom-in-50")}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}
