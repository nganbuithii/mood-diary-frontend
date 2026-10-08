import type { Metadata } from "next";
import { MemoriesView } from "@/components/memories/memories-view";

export const metadata: Metadata = {
  title: "Memories",
};

export default async function MemoriesPage({ searchParams }: PageProps<"/memories">) {
  return <MemoriesView searchParams={await searchParams} />;
}
