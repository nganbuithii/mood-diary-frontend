import type { Metadata } from "next";
import { LetterboxView } from "@/components/letters/letterbox-view";

export const metadata: Metadata = {
  title: "Letterbox",
};

export default async function LettersPage({ searchParams }: PageProps<"/letters">) {
  const { sealed } = await searchParams;
  return <LetterboxView justSealedId={typeof sealed === "string" ? sealed : undefined} />;
}
