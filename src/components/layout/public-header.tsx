import Image from "next/image";
import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75">
      <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-xl text-foreground sm:text-2xl"
        >
          <Image
            src="/images/logo.png"
            alt="Moodiary"
            width={1536}
            height={1024}
            priority
            className="h-11 w-auto shrink-0 sm:h-13"
          />
        </Link>
      </div>
    </header>
  );
}
