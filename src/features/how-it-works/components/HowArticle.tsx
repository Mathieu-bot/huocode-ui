import { Gauge, Grid2x2, History, Info, Ruler } from "lucide-react";
import { ButtonLink } from "@/shared/ui/Button";
import { howCopy } from "../copy";
import { HowQuadrants } from "./HowQuadrants";
import { HowScore } from "./HowScore";
import { HowSection } from "./HowSection";

export function HowArticle() {
  const copy = howCopy();
  return (
    <article className="max-w-[780px]">
      <h1 className="mt-14 mb-3.5 text-[clamp(36px,5vw,52px)] leading-[1.05] font-bold tracking-[-0.03em] text-balance">
        {copy.title}
      </h1>
      <p className="max-w-[65ch] text-[17px] text-ink-2">{copy.intro}</p>
      <HowSection id="how-complexity" icon={Ruler} {...copy.complexity} />
      <HowSection id="how-change" icon={History} {...copy.change} />
      <HowSection id="how-meet" icon={Grid2x2} {...copy.meet}>
        <HowQuadrants />
      </HowSection>
      <HowSection
        id="how-score"
        icon={Gauge}
        heading={copy.score.heading}
        body={copy.score.body}
      >
        <HowScore score={copy.score} bands={copy.bands} />
      </HowSection>
      <HowSection
        id="how-limits"
        icon={Info}
        heading={copy.limits.heading}
        body={copy.limits.body}
      >
        <p className="mt-4 max-w-[65ch] text-[17px] text-ink-2">
          {copy.limits.disclaimer}
        </p>
      </HowSection>
      <ButtonLink href="/" variant="primary" className="mt-10">
        {copy.cta}
      </ButtonLink>
    </article>
  );
}
