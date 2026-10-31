"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJob, submitAnalysis } from "@/api/analysis";
import { type ApiFailure, toApiFailure } from "@/api/failures";
import {
  analyzePath,
  type RepoRef,
  reportPath,
  repoUrl,
} from "@/shared/lib/repo";

const POLL_MS = 4000;
const GIVE_UP_MS = 15 * 60 * 1000;
const MIN_SYNC_MS = 1500;

export type AnalysisState =
  | { kind: "running" }
  | {
      kind: "waiting";
      jobId: string;
      estimatedSeconds: number | null;
      startedAt: number;
    }
  | { kind: "stopped"; jobId: string }
  | { kind: "challenge" }
  | { kind: "failed"; failure: ApiFailure; failedAt: number };

const sleep = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export function useAnalysis(ref: RepoRef, initialJobId: string | null) {
  const router = useRouter();
  const [state, setState] = useState<AnalysisState>(() =>
    initialJobId
      ? {
          kind: "waiting",
          jobId: initialJobId,
          estimatedSeconds: null,
          startedAt: Date.now(),
        }
      : { kind: "running" },
  );
  const run = useRef(0);

  const finish = useCallback(
    async (startedAt: number) => {
      const wait = MIN_SYNC_MS - (Date.now() - startedAt);
      if (wait > 0) await sleep(wait);
      router.replace(reportPath(ref));
    },
    [router, ref],
  );

  const fail = useCallback((error: unknown) => {
    const failure = toApiFailure(error);
    if (failure.kind === "api" && failure.code === "CHALLENGE_REQUIRED") {
      setState({ kind: "challenge" });
    } else {
      setState({ kind: "failed", failure, failedAt: Date.now() });
    }
  }, []);

  const poll = useCallback(
    async (jobId: string, startedAt: number, token: number) => {
      while (run.current === token) {
        if (Date.now() - startedAt > GIVE_UP_MS) {
          setState({ kind: "stopped", jobId });
          return;
        }
        try {
          const job = await fetchJob(jobId);
          if (run.current !== token) return;
          if (job.kind === "ready") {
            document.title = `✓ ${ref.owner}/${ref.repo} · HuoCode`;
            return finish(0);
          }
          if (job.kind === "failed") {
            const failure: ApiFailure = {
              kind: "api",
              code: job.code,
              retryAfterSeconds: null,
            };
            setState({ kind: "failed", failure, failedAt: Date.now() });
            return;
          }
        } catch (error) {
          if (run.current === token) fail(error);
          return;
        }
        await sleep(POLL_MS);
      }
    },
    [finish, fail, ref],
  );

  const submit = useCallback(
    async (turnstileToken?: string) => {
      const token = ++run.current;
      const startedAt = Date.now();
      try {
        const outcome = await submitAnalysis(repoUrl(ref), turnstileToken);
        if (run.current !== token) return;
        if (outcome.kind === "ready") return finish(startedAt);
        const { jobId, estimatedSeconds } = outcome.job;
        router.replace(analyzePath(ref, jobId), { scroll: false });
        setState({
          kind: "waiting",
          jobId,
          estimatedSeconds: estimatedSeconds ?? null,
          startedAt,
        });
        await poll(jobId, startedAt, token);
      } catch (error) {
        if (run.current === token) fail(error);
      }
    },
    [ref, router, finish, poll, fail],
  );

  useEffect(() => {
    if (initialJobId) {
      void poll(initialJobId, Date.now(), ++run.current);
    } else {
      void submit();
    }
    return () => {
      // run.current is a generation counter, not a DOM node: bumping it cancels this page's loop.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      run.current++;
    };
    // Start once per page: retries go through the returned actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(
    (turnstileToken?: string) => {
      setState({ kind: "running" });
      router.replace(analyzePath(ref), { scroll: false });
      void submit(turnstileToken);
    },
    [router, ref, submit],
  );

  const checkAgain = useCallback(
    (jobId: string) => {
      const startedAt = Date.now();
      setState({ kind: "waiting", jobId, estimatedSeconds: null, startedAt });
      void poll(jobId, startedAt, ++run.current);
    },
    [poll],
  );

  return { state, retry, checkAgain };
}
