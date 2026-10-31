import { ExamplePreview, Hero, QuadrantGuide } from "@/features/landing";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <Hero />
          <ExamplePreview />
        </div>
        <QuadrantGuide />
      </main>
      <SiteFooter />
    </>
  );
}
