import type { Metadata } from "next";
import { Nunito, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  weight: "400",
  variable: "--font-patrick-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Diary",
  description: "A warm little journal for your everyday feelings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[url('/images/bg_home.png')] bg-contain bg-top bg-no-repeat lg:bg-cover lg:bg-center lg:bg-fixed">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
