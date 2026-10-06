import type { Metadata } from "next";
import { Nunito, Patrick_Hand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

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
  title: {
    default: "Mood Diary",
    template: "%s · Mood Diary",
  },
  description: "A warm little journal for your everyday feelings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script adds the "dark" class before React hydrates, so the server-rendered
    // class list never matches; suppressHydrationWarning silences that expected mismatch.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${patrickHand.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before first paint so a dark-mode user never sees a flash of the light theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-[url('/images/bg_home.png')] bg-contain bg-top bg-no-repeat lg:bg-cover lg:bg-center lg:bg-fixed dark:bg-none">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
