"use client";

import { GitBranch, Loader, ScanSearch } from "lucide-react";
import { Suspense } from "react";
import { FailureState } from "@/components/analyze/FailureState";
import { ButtonLink } from "@/components/ui/Button";
import { reportCopy } from "@/copy/report";
import { useReport } from "@/hooks/useReport";
import { analyzePath, type RepoRef, repoSlug, reportPath } from "@/lib/repo";
import { ReportScreen } from "./ReportScreen";

/** Loads the report and routes between its states: loading, not mapped yet, failed, ready. */
export function ReportGate({ owner, repo }: RepoRef) {
  const ref = { owner, repo };
  const slug = repoSlug(ref);
  const { state, retry } = useReport(ref);

  if (state.kind === "ready") {
    return (
      <Suspense>
        <ReportScreen refName={ref} report={state.report} />
      </Suspense>
    );
  }

  return (
    <div className="mx-auto mt-14 max-w-[740px] sm:mt-16">
      <span className="inline-flex items-center gap-2 font-mono text-[15px] text-ink-2">
        <GitBranch size={15} strokeWidth={1.5} aria-hidden />
        {slug}
      </span>
      {state.kind === "loading" && (
        <p className="mt-6 flex items-center gap-2.5 text-ink-2" role="status">
          <Loader
            size={18}
            strokeWidth={1.5}
            className="animate-spin text-garnet motion-reduce:animate-none"
            aria-hidden
          />
          {reportCopy.loading}
        </p>
      )}
      {state.kind === "missing" && (
        <section className="panel mt-4 grid justify-items-start gap-4 p-10">
          <h1 className="text-[32px] font-bold tracking-[-0.02em]">
            {reportCopy.notMappedTitle}
          </h1>
          <p className="text-ink-2">{reportCopy.notMappedBody}</p>
          <ButtonLink href={analyzePath(ref)} variant="rose">
            <ScanSearch size={18} strokeWidth={1.5} aria-hidden />
            {reportCopy.mapIt(slug)}
          </ButtonLink>
        </section>
      )}
      {state.kind === "failed" && (
        <div className="mt-4">
          <FailureState
            repo={slug}
            reportHref={reportPath(ref)}
            failure={state.failure}
            failedAt={state.failedAt}
            onRetry={retry}
          />
        </div>
      )}
    </div>
  );
}
