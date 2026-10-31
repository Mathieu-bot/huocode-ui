import type { FileResult } from "@/api-client/api";
import { overviewCopy } from "@/copy/overview";
import { StartRow } from "./StartRow";

export function StartHere({ files }: { files: FileResult[] }) {
  if (files.length === 0) return null;
  return (
    <section aria-labelledby="overview-start">
      <div className="mt-11 mb-3.5">
        <h2
          id="overview-start"
          className="text-[28px] font-semibold tracking-[-0.015em]"
        >
          {overviewCopy.startTitle}
        </h2>
        <p className="mt-1 text-[14.5px] text-ink-2">
          {overviewCopy.startIntro(files.length)}
        </p>
      </div>
      <ol className="grid gap-2.5">
        {files.map((file, i) => (
          <StartRow key={file.path} file={file} rank={i + 1} />
        ))}
      </ol>
    </section>
  );
}
