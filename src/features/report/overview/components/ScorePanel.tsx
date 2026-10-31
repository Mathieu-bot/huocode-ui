"use client";

import { CircleCheck, Eye, Flame, Gauge, Scale } from "lucide-react";
import { overviewCopy } from "../copy";
import { BAND_LABEL } from "../../copy";
import { type Band, band } from "../../model";
import { ScoreTape } from "./ScoreTape";
import { useCountUp } from "../hooks/useCountUp";

export const icon = {
  size: 15,
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;
const BAND_ICON = { ok: CircleCheck, warn: Eye, crit: Flame };
const BAND_TEXT: Record<Band, string> = {
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
};

export function PanelTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink-2 ${className}`}
    >
      {children}
    </h2>
  );
}

export function ScorePanel({
  score,
  hotspots,
  production,
}: {
  score: number;
  hotspots: number;
  production: number;
}) {
  const shown = useCountUp(score);
  const level = band(score);
  const BandIcon = BAND_ICON[level];
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
        <span
          className={`inline-flex items-center gap-1.5 text-[17px] font-bold ${BAND_TEXT[level]}`}
        >
          <BandIcon {...icon} />
          {BAND_LABEL[level]}
        </span>
      </div>
      <div className="text-[80px] leading-[.86] font-semibold tracking-[-0.03em] tabular-nums sm:text-[108px]">
        <span aria-hidden>{Math.round(shown)}</span>
        <span className="sr-only">{score}</span>
        <small className="ml-1.5 text-xl font-medium tracking-normal text-ink-3">
          {overviewCopy.outOf}
        </small>
      </div>
      <ScoreTape value={shown} />
      <p className="m-0 max-w-[34em] text-lg leading-[1.45]">
        {hotspots > 0 ? (
          <>
            <b className="text-q-hot">{overviewCopy.verdictHot(hotspots)}</b>
            {overviewCopy.verdictHotRest}
          </>
        ) : (
          overviewCopy.verdictCalm
        )}
      </p>
      <p className="flex items-start gap-2 text-[13.5px] text-ink-2">
        <Scale {...icon} className="mt-0.5 shrink-0" />
        {overviewCopy.scoreFoot(production)}
      </p>
    </section>
  );
}
