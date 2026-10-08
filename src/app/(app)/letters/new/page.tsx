import type { Metadata } from "next";
import { NewLetterView } from "@/components/letters/new-letter-view";

export const metadata: Metadata = {
  title: "Write a letter",
};

export default function NewLetterPage() {
  return <NewLetterView />;
}
