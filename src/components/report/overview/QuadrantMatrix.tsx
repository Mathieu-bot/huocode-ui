"use client";

import { ArrowRight, ArrowUp, Grid2x2 } from "lucide-react";
import type { Quadrant, QuadrantSummary } from "@/api-client/api";
import { overviewCopy } from "@/copy/overview";
import { quadrantCopy } from "@/copy/quadrants";
import { useReportContext } from "../ReportContext";
import { icon, PanelTitle } from "./ScorePanel";

const KEY: Record<Quadrant, keyof QuadrantSummary> = {
  hotspot: "hotspot",
  complex_stable: "complexStable",
  frequent_simple: "frequentSimple",
  healthy: "healthy",
};
/** Reading order: complexity grows upward, change grows to the right. */
const LAYOUT: Quadrant[] = [
  "complex_stable",
  "hotspot",
  "healthy",
  "frequent_simple",
];

export function QuadrantMatrix({
  summary,
  tests,
  otherLanguages,
}: {
  summary: QuadrantSummary;
  tests: number;
  otherLanguages: number;
}) {
  const { setFocus, goTab } = useReportContext();
  return (
    <section
      className="panel grid gap-3 px-[22px] pt-5 pb-[18px]"
      aria-label={overviewCopy.matrixTitle}
    >
      <PanelTitle>
        <Grid2x2 {...icon} />
        {overviewCopy.matrixTitle}
        <span className="font-medium">{overviewCopy.matrixHint}</span>
      </PanelTitle>
      <div className="grid grid-cols-[22px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_22px] gap-2">
        <div className="flex rotate-180 items-center justify-center gap-1 text-[12.5px] text-ink-2 [writing-mode:vertical-rl]">
          <ArrowUp {...icon} className="rotate-180" />
          {overviewCopy.moreComplex}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUT.map((quadrant) => {
            const copy = quadrantCopy(quadrant);
            const count = summary[KEY[quadrant]] ?? 0;
            return (
              <button
                key={quadrant}
                type="button"
                onClick={() => {
                  setFocus(quadrant);
                  goTab("files");
                }}
                className="grid min-h-[92px] cursor-pointer grid-cols-[30px_auto_1fr] items-center gap-x-3 gap-y-0.5 rounded-lg border border-seam-strong bg-linen py-3 pr-3 pl-2.5 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-ink hover:shadow-[0_8px_20px_-14px_rgb(43_27_48/.5)] max-sm:grid-cols-[22px_1fr] max-sm:gap-x-2"
              >
                <span
                  className="pinked row-span-2 h-16 w-[30px] rounded-[2px] max-sm:row-span-1 max-sm:h-10 max-sm:w-[22px]"
                  style={{ background: copy.color }}
                  aria-hidden
                />
                <span
                  className={`row-span-2 min-w-[1.1em] text-[44px] leading-none font-semibold max-sm:row-span-1 max-sm:text-[34px] ${count ? "" : "text-ink-3"}`}
                >
                  {count}
                </span>
                <span className="text-[15px] font-bold max-sm:col-span-2">
                  {copy.label}
                </span>
                <span className="text-[13px] text-ink-2 max-sm:col-span-2">
                  {copy.short}
                </span>
              </button>
            );
          })}
        </div>
        <div className="col-start-2 flex items-center justify-center gap-1 text-[12.5px] text-ink-2">
          {overviewCopy.changesMore}
          <ArrowRight {...icon} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13.5px] text-ink-2">
        <span className="inline-flex items-center gap-[7px]">
          <i className="inline-block size-3 flex-none rounded-[2px] bg-q-test" />
          {overviewCopy.testFiles(tests)}
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <i className="hatch inline-block size-3 flex-none rounded-[2px]" />
          {overviewCopy.otherLanguages(otherLanguages)}
        </span>
      </div>
    </section>
  );
}
