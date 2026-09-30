import { RepoField } from "@/components/site/RepoField";
import { landingCopy } from "@/copy/landing";

export function Hero() {
  const copy = landingCopy();

  return (
    <section className="pt-10 pb-10 text-center sm:pt-16">
      <h1 className="font-display text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
        {copy.titleLines[0]}
        <br />
        {copy.titleLines[1]}
      </h1>
      <p className="mx-auto mt-8 max-w-2xl text-lg text-secondary">
        {copy.subtitle}
      </p>
      <p className="mx-auto mt-0 max-w-2xl text-lg text-secondary">
        {copy.subnote}
      </p>
    </section>
  );
}

export function HeroAndField() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <Hero />
      <RepoField />
    </div>
  );
}
