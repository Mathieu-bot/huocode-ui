"use client";

import { useState } from "react";
import { mapCopy } from "@/copy/map";
import { FileTag } from "./FileTag";
import { MapBar } from "./map/MapBar";
import { MapCanvas } from "./map/MapCanvas";
import { MapLegend } from "./map/MapLegend";
import { useReportContext } from "./ReportContext";

/** Map tab: treemap (or scatter) on the left, the selected file's details on the right. */
export function MapTab() {
  const { report, selected } = useReportContext();
  const relative = report.relativeScoringEnabled;
  const [dir, setDir] = useState<string | null>(null);
  const file = report.files.find((f) => f.path === selected);

  return (
    <div className="grid grid-cols-1 items-start gap-[18px] min-[1081px]:grid-cols-[minmax(0,1fr)_330px]">
      <section className="panel min-w-0 p-3.5" aria-label={mapCopy.panelLabel}>
        <MapBar dir={dir} onRoot={() => setDir(null)} />
        <MapCanvas dir={dir} onZoom={setDir} />
        <MapLegend relative={relative} />
      </section>
      <aside
        aria-live="polite"
        className="panel p-5 min-[1081px]:sticky min-[1081px]:top-[calc(var(--top-h)+72px)]"
      >
        {file ? (
          <FileTag file={file} compact />
        ) : (
          <p className="text-ink-2">{mapCopy.pickFile}</p>
        )}
      </aside>
    </div>
  );
}
