import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  label,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
        <span aria-hidden>♡</span> {label}
      </h1>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onToday}
        >
          Today
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onPrev}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onNext}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
