"use client";

import { useReportContext } from "./ReportContext";

/** Placeholder: replaced by the Files tab implementation. */
export function FilesTab() {
  const { report } = useReportContext();
  return (
    <section className="panel p-6 text-ink-2">Files for {report.repo}</section>
  );
}
