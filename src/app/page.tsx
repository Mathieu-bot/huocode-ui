import { HeroAndField } from "@/components/site/Hero";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroAndField />
      </main>
      <footer className="mt-auto border-t-[3px] border-ink">
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-secondary">
          <span>HuoCode — code health, mapped.</span>
          <a
            href="https://github.com/huocode-bot/huocode"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-ink"
          >
            Source
          </a>
        </div>
      </footer>
    </>
  );
}
