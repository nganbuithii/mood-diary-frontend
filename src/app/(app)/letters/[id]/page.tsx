import type { Metadata } from "next";
import { LetterDetailView } from "@/components/letters/letter-detail-view";

export const metadata: Metadata = {
  title: "A letter",
};

export default async function LetterPage({ params }: PageProps<"/letters/[id]">) {
  const { id } = await params;
  return <LetterDetailView id={id} />;
}
