"use client";

import { useCallback, useRef, useState } from "react";

interface TooltipState {
  content: React.ReactNode;
  x: number;
  y: number;
}

export function useMarkTooltip<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const show = useCallback((mark: HTMLElement, content: React.ReactNode) => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    const rect = mark.getBoundingClientRect();
    setTooltip({ content, x: rect.left + rect.width / 2 - box.left, y: rect.top - box.top });
  }, []);

  const hide = useCallback(() => setTooltip(null), []);

  const bind = (content: React.ReactNode) => ({
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => show(event.currentTarget, content),
    onPointerLeave: hide,
    onFocus: (event: React.FocusEvent<HTMLElement>) => show(event.currentTarget, content),
    onBlur: hide,
  });

  return { containerRef, tooltip, bind };
}

export function ChartTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-2"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <div className="rounded-xl border border-border/70 bg-surface px-3 py-1.5 text-xs whitespace-nowrap text-foreground shadow-md">
        {tooltip.content}
      </div>
    </div>
  );
}
