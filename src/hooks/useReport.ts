"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalysisResult } from "@/api-client/api";
import { type ApiFailure, toApiFailure } from "@/api/failures";
import { fetchReport } from "@/api/reports";
import type { RepoRef } from "@/lib/repo";

export type ReportState =
  | { kind: "loading" }
  | { kind: "ready"; report: AnalysisResult }
  | { kind: "missing" }
  | { kind: "failed"; failure: ApiFailure; failedAt: number };

export function useReport({ owner, repo }: RepoRef) {
  const [state, setState] = useState<ReportState>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchReport(owner, repo)
      .then((report) => alive && setState({ kind: "ready", report }))
      .catch((error: unknown) => {
        if (!alive) return;
        const failure = toApiFailure(error);
        const missing =
          failure.kind === "api" && failure.code === "REPORT_NOT_FOUND";
        const notFound = failure.kind === "http" && failure.status === 404;
        setState(
          missing || notFound
            ? { kind: "missing" }
            : { kind: "failed", failure, failedAt: Date.now() },
        );
      });
    return () => {
      alive = false;
    };
  }, [owner, repo, attempt]);

  const retry = useCallback(() => {
    setState({ kind: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
