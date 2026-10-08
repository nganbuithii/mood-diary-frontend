import type { Metadata } from "next";
import { DiaryCalendarView } from "@/components/calendar/diary-calendar-view";

export const metadata: Metadata = {
  title: "My Diary",
};

export default async function DiaryPage({ searchParams }: PageProps<"/diary">) {
  const { date } = await searchParams;
  return <DiaryCalendarView dateParam={date} />;
}
