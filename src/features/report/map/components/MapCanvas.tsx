"use client";

import { useMemo, useRef } from "react";
import { mapHeight } from "../layout";
import { useReportContext } from "../../shell/ReportContext";
import { MapTooltip } from "./MapTooltip";
import { Scatter, scatterHeight } from "./Scatter";
import { Treemap } from "./Treemap";
import type { MapView } from "../hooks/useMapView";
import { useTip } from "../hooks/useTip";
import { useWidth } from "../hooks/useWidth";

type Props = {
  view: MapView;
  dir: string | null;
  onZoom: (dir: string) => void;
};

/** Measures the panel, draws the chosen view and hosts its tooltip. */
export function MapCanvas({ view, dir, onZoom }: Props) {
  const { report, selected, select, focus } = useReportContext();
  const host = useRef<HTMLDivElement>(null);
  const width = useWidth(host);
  const byPath = useMemo(
    () => new Map(report.files.map((f) => [f.path, f])),
    [report],
  );
  const { tip, ...handlers } = useTip(byPath);
  const minHeight =
    view === "scatter" ? scatterHeight(width) : mapHeight(width);
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
      {width > 0 &&
        (view === "scatter" ? (
          <Scatter {...props} />
        ) : (
          <Treemap {...props} dir={dir} onZoom={onZoom} />
        ))}
      {tip && <MapTooltip tip={tip} />}
    </div>
  );
}
