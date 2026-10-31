"use client";

import { useLayoutEffect, useRef } from "react";
import type { FileResult } from "@/api-client/api";
import { mapCopy } from "@/copy/map";
import { quadrantCopy } from "@/copy/quadrants";
import {
  BAND_LABEL,
  FILE_ERROR,
  fmt,
  languageName,
  reportCopy,
} from "@/copy/report";
import { band, linesChanged, splitPath } from "@/lib/report";

export type TipState = { file: FileResult; x: number; y: number };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[5px] flex justify-between gap-2.5 text-[#D9CBD3]">
      <span>{label}</span>
      <span className="text-right font-mono text-white">{value}</span>
    </div>
  );
}

function TipBody({ file }: { file: FileResult }) {
  const { dir, name } = splitPath(file.path);
  const head = (
    <>
      <b className="font-mono text-[13.5px] break-all">{name}</b>
      <div className="font-mono text-xs break-all text-[#CDBBC6]">{dir}</div>
    </>
  );
  if (file.status !== "analyzed") {
    const reason =
      file.status === "error"
        ? (FILE_ERROR[file.errorCode ?? ""] ?? reportCopy.couldNotRead)
        : reportCopy.notAnalyzed(languageName(file.unsupportedLanguage));
    return (
      <>
        {head}
        <div className="mt-[5px] text-[#D9CBD3]">{reason}</div>
      </>
    );
  }
  const score = file.codeHealthScore;
  const group = file.quadrant
    ? `${quadrantCopy(file.quadrant).label}${file.isTest ? ` · ${reportCopy.test}` : ""}`
    : file.isTest
      ? reportCopy.test
      : null;
  const cc = file.complexity ?? 0;
  return (
    <>
      {head}
      {score !== undefined && (
        <Row
          label={mapCopy.tipHealth}
          value={`${score} · ${BAND_LABEL[band(score)]}`}
        />
      )}
      {group && <Row label={mapCopy.tipGroup} value={group} />}
      <Row
        label={mapCopy.tipComplex}
        value={`${cc}${file.exceedsCommonComplexityThreshold ? ` · ${mapCopy.tipOver}` : ""}`}
      />
      <Row label={mapCopy.tipLines} value={fmt(linesChanged(file))} />
      <Row
        label={mapCopy.tipActivity}
        value={`${file.churn?.commits ?? 0} · ${file.churn?.authors ?? 0}`}
      />
    </>
  );
}

/** Dark hover card, kept inside the map host (flips left or up near the edges). */
export function MapTooltip({ tip }: { tip: TipState }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const w = host.clientWidth;
    const h = host.clientHeight;
    let x = tip.x + 16;
    let y = tip.y + 16;
    if (x + el.offsetWidth + 10 > w)
      x = Math.max(0, tip.x - el.offsetWidth - 16);
    if (y + el.offsetHeight > h) y = Math.max(0, tip.y - el.offsetHeight - 12);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }, [tip]);
  return (
    <div
      ref={ref}
      role="tooltip"
      className="pointer-events-none absolute top-0 left-0 z-[5] w-[270px] max-w-[calc(100%-8px)] rounded-[10px] bg-ink px-3.5 py-3 text-[13px] text-[#F6EEF1] shadow-[0_12px_28px_-10px_rgba(27,18,32,.5)]"
    >
      <TipBody file={tip.file} />
    </div>
  );
}
