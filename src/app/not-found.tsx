import { Compass } from "lucide-react";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import { ButtonLink } from "@/shared/ui/Button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="w-full flex-1 px-4 sm:px-6">
        <section className="panel mx-auto mt-16 grid max-w-[640px] justify-items-start gap-4 p-10">
          <span className="grid size-10 place-items-center rounded-full bg-blush text-garnet">
            <Compass size={20} strokeWidth={1.5} aria-hidden />
          </span>
          <h1 className="text-[32px] font-bold tracking-[-0.02em]">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-ink-2">
            The address may be mistyped. Paste a GitHub repository on the home
            page to map it.
          </p>
          <ButtonLink href="/" variant="rose">
            Map a repository
          </ButtonLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
