import { Hero } from "@/features/landing";
import { QuadrantGuide } from "@/features/landing";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 sm:px-6">
        <Hero />
        <QuadrantGuide />
      </main>
      <SiteFooter />
    </>
  );
}
