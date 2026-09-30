import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-canvas">
      <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/symbol.svg"
            alt=""
            width={32}
            height={32}
            priority
          />
          <span className="font-display text-2xl font-bold tracking-tight">
            Huo<span className="text-accent">Code</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a
            href="https://github.com/huocode-bot/huocode"
            target="_blank"
            rel="noopener noreferrer"
            className="hard-lift rounded px-2 py-1 hover:bg-chip"
          >
            Source
          </a>
        </nav>
      </div>
    </header>
  );
}
