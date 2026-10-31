import { CircleMinus, Gauge, Ruler } from "lucide-react";
import { overviewCopy } from "../copy";
import { icon, PanelTitle } from "./ScorePanel";

export function NoScorePanel({
  javaFiles,
  over,
}: {
  javaFiles: number;
  over: number;
}) {
  return (
    <section
      className="panel grid content-start gap-4 px-[26px] pt-6 pb-[22px]"
      aria-label={overviewCopy.health}
    >
      <div className="flex items-start justify-between gap-3">
        <PanelTitle>
          <Gauge {...icon} />
          {overviewCopy.health}
        </PanelTitle>
        <span className="inline-flex items-center gap-1.5 text-[17px] font-bold text-ink-2">
          <CircleMinus {...icon} />
          {overviewCopy.noScore}
        </span>
      </div>
      <div
        className="text-[80px] leading-[.86] font-semibold text-ink-3 sm:text-[108px]"
        aria-hidden
      >
        —
      </div>
      <p className="m-0 max-w-[34em] text-lg leading-[1.45]">
        {overviewCopy.tooFew(javaFiles)}
      </p>
      <p className="flex items-start gap-2 text-[13.5px] text-ink-2">
        <Ruler {...icon} className="mt-0.5 shrink-0" />
        <span>
          {overviewCopy.holdsAlone}{" "}
          <b className="text-ink">{overviewCopy.overCount(over)}</b>
        </span>
      </p>
    </section>
  );
}
