import { BookOpen, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteCopy } from "@/copy/site";

export function SiteHeader() {
  const copy = siteCopy();
  return (
    <header className="sticky top-0 z-50 h-[var(--top-h)] bg-ink text-[#f4ecef]">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label={copy.home} className="flex items-center">
          <Image
            src="/logo/horizontal-logo-dark.svg"
            alt="HuoCode"
            width={128}
            height={30}
            priority
          />
        </Link>
        <nav
          aria-label={copy.mainNav}
          className="flex items-center gap-5 text-[14.5px] text-[#d9c9d2]"
        >
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 no-underline hover:text-white"
          >
            <BookOpen size={18} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{copy.howItWorks}</span>
          </Link>
          <a
            href="https://github.com/huocode-bot/huocode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 no-underline hover:text-white"
          >
            <Github size={18} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{copy.source}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
