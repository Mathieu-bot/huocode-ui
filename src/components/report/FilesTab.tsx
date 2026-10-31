"use client";

import { filesCopy } from "@/copy/files";
import { Explorer } from "./files/Explorer";
import { FileTag } from "./FileTag";
import { useReportContext } from "./ReportContext";

const STICKY = "min-[1080px]:sticky min-[1080px]:top-[calc(var(--top-h)+72px)]";

/** Files tab: every file in a searchable explorer, with the selected file's detail. */
export function FilesTab() {
  const { report, selected } = useReportContext();
  const file = report.files.find((f) => f.path === selected);
  return (
    <div className="grid items-start gap-[18px] min-[1080px]:grid-cols-[400px_minmax(0,1fr)]">
      <Explorer
        className={`h-[60vh] ${STICKY} min-[1080px]:h-[calc(100vh-var(--top-h)-96px)] min-[1080px]:max-h-[820px] min-[1080px]:min-h-[480px]`}
      />
      <section
        aria-label={filesCopy.detailLabel}
        aria-live="polite"
        className={`panel p-5 ${STICKY}`}
      >
        {file ? (
          <FileTag file={file} />
        ) : (
          <p className="text-ink-2">{filesCopy.noSelection}</p>
        )}
      </section>
    </div>
  );
}
