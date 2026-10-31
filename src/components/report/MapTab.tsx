"use client";

import { useReportContext } from "./ReportContext";

/** Placeholder: replaced by the Map tab implementation. */
export function MapTab() {
  const { report } = useReportContext();
  return (
    <section className="panel p-6 text-ink-2">Map for {report.repo}</section>
  );
}
