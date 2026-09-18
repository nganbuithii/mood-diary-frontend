"use client";

import { useState } from "react";
import { cn } from "cn";

import { MoodPolaroid } from "@/components/mood-diary/mood-polaroid";
import type { Mood } from "@/components/mood-diary/mood.constants";

interface RecentMemory {
  id: string;
  mood: Mood;
  date: string;
  note?: string;
  rotate: "left" | "none" | "right";
}

const MY_MEMORIES: RecentMemory[] = [
  {
    id: "1",
    mood: "HAPPY",
    date: "Sep 14",
    note: "Coffee with an old friend, felt so nice.",
    rotate: "left",
  },
  {
    id: "2",
    mood: "VERY_HAPPY",
    date: "Sep 12",
    note: "Finished my side project demo!",
    rotate: "none",
  },
  {
    id: "3",
    mood: "NEUTRAL",
    date: "Sep 10",
    note: "Quiet Tuesday, lots of rain.",
    rotate: "right",
  },
  {
    id: "4",
    mood: "SAD",
    date: "Sep 8",
    note: "Missed the bus twice, rough morning.",
    rotate: "left",
  },
];

type FeedTab = "mine" | "friends";

const TABS: { id: FeedTab; label: string }[] = [
  { id: "mine", label: "♡ My little world" },
  { id: "friends", label: "୨୧ Friends' moments" },
];

export function RecentMemoriesSection() {
  const [tab, setTab] = useState<FeedTab>("mine");

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px flex-1 bg-border" />
        <h2 className="shrink-0 font-heading text-lg text-foreground sm:text-xl">
          <span aria-hidden>♡</span> Recent memories <span aria-hidden>♡</span>
        </h2>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>

      <div
        role="tablist"
        aria-label="Memories feed"
        className="flex justify-center gap-2"
      >
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full border border-transparent px-4 py-1.5 text-sm text-muted-foreground transition-all",
                isActive
                  ? "border-border bg-surface text-foreground shadow-sm"
                  : "hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "mine" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MY_MEMORIES.map((memory) => (
            <MoodPolaroid
              key={memory.id}
              mood={memory.mood}
              date={memory.date}
              note={memory.note}
              rotate={memory.rotate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
          <span aria-hidden className="text-2xl">
            ✿
          </span>
          <p className="font-heading text-lg text-foreground">
            Friends&apos; moments are coming soon
          </p>
          <p className="text-sm text-muted-foreground">
            Once you add friends, their little diary pages will show up here.
          </p>
        </div>
      )}
    </section>
  );
}
