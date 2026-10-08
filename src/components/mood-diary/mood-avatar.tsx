import type { ComponentProps } from "react";
import { cn } from "cn";

import { MoodFace } from "@/components/mood-diary/mood-face";
import { MOOD_META } from "@/components/mood-diary/mood.constants";
import type { Mood } from "@/features/diary/types/mood.types";

interface MoodAvatarProps extends ComponentProps<"span"> {
  mood: Mood;
}

export function MoodAvatar({ mood, className, children, ...props }: MoodAvatarProps) {
  return (
    <span className={cn("block shrink-0 rounded-full", MOOD_META[mood].bgClass, className)} {...props}>
      <MoodFace mood={mood} />
      {children}
    </span>
  );
}
