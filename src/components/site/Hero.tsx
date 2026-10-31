import { Coffee, Link2 } from "lucide-react";
import { RepoField } from "@/components/site/RepoField";
import { landingCopy } from "@/copy/landing";

export function Hero() {
  const copy = landingCopy();
  const [a, b, c, d, e] = copy.shortcut;

  return (
    <section className="max-w-[720px] pt-14 pb-2 sm:pt-[72px]">
      <h1 className="text-[clamp(40px,5vw,64px)] leading-[1.05] font-bold tracking-[-0.035em] text-balance">
        {copy.titleStart}
        <span className="underline decoration-garnet decoration-dashed decoration-2 underline-offset-[10px]">
          {copy.titleStitched}
        </span>
        .
      </h1>
      <p className="mt-[22px] mb-[30px] max-w-[33em] text-[18.5px] text-ink-2">
        {copy.subtitle}
      </p>
      <RepoField showExamples />
      <div className="mt-[22px] grid gap-1.5 text-[13.5px] text-ink-2">
        <span className="inline-flex items-center gap-2">
          <Coffee size={15} strokeWidth={1.5} aria-hidden />
          {copy.javaOnly}
        </span>
        <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
          <Link2 size={15} strokeWidth={1.5} aria-hidden className="mr-1" />
          {a}
          <b className="num font-semibold">{b}</b>
          {c}
          <b className="num font-semibold">{d}</b>
          {e}
        </span>
      </div>
    </section>
  );
}
