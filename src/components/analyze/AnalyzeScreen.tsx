"use client";

import { GitBranch, Hourglass, RotateCcw } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { analyzeCopy } from "@/copy/analyze";
import { useAnalysis } from "@/hooks/useAnalysis";
import { analyzePath, type RepoRef, repoSlug, reportPath } from "@/lib/repo";
import { ChallengeGate } from "./ChallengeGate";
import { FailureState } from "./FailureState";
import { JobProgress } from "./JobProgress";
import { SyncProgress } from "./SyncProgress";

export function AnalyzeScreen({
  owner,
  repo,
  jobId,
}: RepoRef & { jobId: string | null }) {
  const [ref] = useState<RepoRef>(() => ({ owner, repo }));
  const slug = repoSlug(ref);
  const copy = analyzeCopy(slug);
  const { state, retry, checkAgain } = useAnalysis(ref, jobId);
  const [syncStart] = useState(() => Date.now());
  const waiting = state.kind === "waiting" || state.kind === "stopped";
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );

  return (
    <div
      className={`mx-auto mt-14 sm:mt-20 ${waiting ? "max-w-[1000px]" : "max-w-[660px]"}`}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[15px] text-ink-2">
        <GitBranch size={15} strokeWidth={1.5} aria-hidden />
        {slug}
      </span>
      <h1 className="mt-2 mb-[26px] text-[clamp(30px,4vw,40px)] font-bold tracking-[-0.025em]">
        {state.kind === "failed"
          ? copy.failedTitle
          : state.kind === "challenge"
            ? copy.challengeHeading
            : waiting
              ? copy.jobTitle
              : copy.syncTitle}
      </h1>

      {state.kind === "running" && (
        <SyncProgress repo={slug} startedAt={syncStart} />
      )}

      {state.kind === "waiting" && (
        <JobProgress
          repo={slug}
          startedAt={state.startedAt}
          estimatedSeconds={state.estimatedSeconds}
          link={`${origin}${analyzePath(ref, state.jobId)}`}
        />
      )}

      {state.kind === "stopped" && (
        <section className="panel grid max-w-[560px] gap-3 p-6" role="status">
          <span className="grid size-10 place-items-center rounded-full bg-[#fbf1dd] text-warn">
            <Hourglass size={20} strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="text-lg font-bold">{copy.stoppedTitle}</h2>
          <p className="text-[15px] text-ink-2">{copy.stoppedBody}</p>
          <Button
            className="justify-self-start"
            size="sm"
            onClick={() => checkAgain(state.jobId)}
          >
            <RotateCcw size={15} strokeWidth={1.5} aria-hidden />
            {copy.checkAgain}
          </Button>
        </section>
      )}

      {state.kind === "challenge" && (
        <ChallengeGate
          repo={slug}
          onToken={(token) => retry(token)}
          onRetry={() => retry()}
        />
      )}

      {state.kind === "failed" && (
        <FailureState
          repo={slug}
          reportHref={reportPath(ref)}
          failure={state.failure}
          failedAt={state.failedAt}
          onRetry={() => retry()}
        />
      )}
    </div>
  );
}
