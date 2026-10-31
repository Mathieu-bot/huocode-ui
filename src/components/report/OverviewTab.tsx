"use client";

import { useReportContext } from "./ReportContext";

/** Placeholder: replaced by the Overview tab implementation. */
export function OverviewTab() {
  const { report } = useReportContext();
  return (
    <section className="panel p-6 text-ink-2">
      Overview for {report.repo}
    </section>
  );
}
