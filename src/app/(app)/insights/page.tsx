import type { Metadata } from "next";
import { InsightsView } from "@/components/insights/insights-view";

export const metadata: Metadata = {
  title: "Insights",
};

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  const { month } = await searchParams;
  return <InsightsView monthParam={month} />;
}
