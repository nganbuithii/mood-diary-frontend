import type { ReactNode } from "react";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { RetroWindow } from "@/components/mood-diary/retro-window";

interface AuthCardProps {
  windowTitle: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

export function AuthCard({ windowTitle, title, description, children }: AuthCardProps) {
  return (
    <RetroWindow title={windowTitle} className="w-full max-w-sm">
      <div className="mb-6 flex flex-col gap-1 text-center">
        <CardTitle className="text-xl">
          {title} <span aria-hidden>♡</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {children}
    </RetroWindow>
  );
}

interface AuthResultPanelProps {
  windowTitle: string;
  emoji?: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}

export function AuthResultPanel({ windowTitle, emoji, title, description, children }: AuthResultPanelProps) {
  return (
    <RetroWindow title={windowTitle} className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        {emoji && (
          <span aria-hidden className="text-4xl">
            {emoji}
          </span>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {children}
      </div>
    </RetroWindow>
  );
}
