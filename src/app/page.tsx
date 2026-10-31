import { Hero } from "@/components/site/Hero";
import { QuadrantGuide } from "@/components/site/QuadrantGuide";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

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
