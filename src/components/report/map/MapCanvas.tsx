"use client";

import { useMemo, useRef } from "react";
import { mapHeight } from "@/lib/treemap";
import { useReportContext } from "../ReportContext";
import { MapTooltip } from "./MapTooltip";
import { Treemap } from "./Treemap";
import { useTip } from "./useTip";
import { useWidth } from "./useWidth";

type Props = {
  dir: string | null;
  onZoom: (dir: string) => void;
};

/** Measures the panel, draws the treemap and hosts its tooltip. */
export function MapCanvas({ dir, onZoom }: Props) {
  const { report, selected, select, focus } = useReportContext();
  const host = useRef<HTMLDivElement>(null);
  const width = useWidth(host);
  const byPath = useMemo(
    () => new Map(report.files.map((f) => [f.path, f])),
    [report],
  );
  const { tip, ...handlers } = useTip(byPath);
  const minHeight = mapHeight(width);
  const props = {
    files: report.files,
    width,
    selected,
    focus,
    onSelect: select,
  };

  return (
    <div
      ref={host}
      className="relative w-full"
      style={{ minHeight }}
      {...handlers}
    >
      {width > 0 && <Treemap {...props} dir={dir} onZoom={onZoom} />}
      {tip && <MapTooltip tip={tip} />}
    </div>
  );
}
