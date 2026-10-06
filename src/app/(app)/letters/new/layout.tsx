import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write a letter",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
