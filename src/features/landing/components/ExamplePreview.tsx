import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { FileResult } from "@/api-client/api";
import { MiniTreemap } from "@/features/report";
import { QUADRANT_ORDER, quadrantCopy } from "@/shared/copy/quadrants";
import { landingCopy } from "../copy";
import example from "../example-report.json";

const files = example.files as FileResult[];

/** A pinned sample result (real square/javapoet data) that links to its live report. */
export function ExamplePreview() {
  const copy = landingCopy();
  return (
    <Link
      href={`/report/${example.repo}`}
      aria-label={copy.previewOpen(example.repo)}
      className="group panel relative hidden rotate-[-1.2deg] p-[18px] pb-3.5 no-underline transition-transform duration-300 hover:rotate-0 motion-reduce:transition-none max-lg:rotate-0 md:block"
    >
      <span
        aria-hidden
        className="absolute -top-[9px] left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2a1b6,var(--garnet)_60%)] shadow-[0_2px_3px_rgb(0_0_0/0.25)]"
      />
      <div className="mb-3 flex items-baseline justify-between gap-2.5">
        <span className="font-mono font-semibold">{example.repo}</span>
        <span className="flex items-baseline gap-1.5 text-sm text-ink-2">
          {copy.previewScore}
          <b className="text-[28px] leading-none font-bold text-ok tabular-nums">
            {example.repoHealthScore}
          </b>
        </span>
      </div>
      <MiniTreemap files={files} label={copy.previewMapLabel(example.repo)} />
      <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[12.5px] text-ink-2">
        {QUADRANT_ORDER.map((q) => (
          <span key={q} className="inline-flex items-center gap-1.5">
            <i
              className="pinked inline-block size-3 rounded-[2px] [--z:4px]"
              style={{ background: quadrantCopy(q).color }}
              aria-hidden
            />
            {quadrantCopy(q).label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <i
            className="inline-block size-3 rounded-[2px] bg-q-test"
            aria-hidden
          />
          {copy.previewTests}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="hatch inline-block size-3 rounded-[2px]" aria-hidden />
          {copy.previewOther}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-garnet group-hover:underline">
          {copy.previewCta}
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
