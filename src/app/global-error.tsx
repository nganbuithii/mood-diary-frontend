"use client";

import { useEffect } from "react";

// Replaces the root layout when it crashes, so it brings its own <html> and can't rely on app styles.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100svh", margin: 0, textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem" }}>♡ Mood Diary couldn&apos;t load</h1>
          <p style={{ color: "#666" }}>Something went wrong. Please try again.</p>
          <button type="button" onClick={reset} style={{ padding: "0.5rem 1.25rem", borderRadius: 999, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
