"use client";

import {
  CircleAlert,
  Hourglass,
  Lock,
  PackageX,
  RotateCcw,
  ShieldX,
  Timer,
  Unlink,
  Users,
  WifiOff,
} from "lucide-react";
import { createElement } from "react";
import type { ApiFailure } from "@/api/failures";
import { RepoField } from "@/features/landing";
import { Button, ButtonLink } from "@/shared/ui/Button";
import { analyzeCopy, formatClock } from "../copy";
import { failureCopy } from "../failure-copy";
import { useSecondsLeft } from "@/shared/hooks/useTicker";

type Props = {
  repo: string;
  reportHref: string;
  failure: ApiFailure;
  failedAt: number;
  onRetry: () => void;
};

const FIELD_CODES = new Set([
  "INVALID_REPO_URL",
  "REPO_NOT_FOUND_OR_PRIVATE",
  "REPO_TOO_LARGE",
]);

function iconFor(failure: ApiFailure) {
  if (failure.kind === "offline") return WifiOff;
  if (failure.kind === "http") return CircleAlert;
  return (
    (
      {
        REPO_NOT_FOUND_OR_PRIVATE: Lock,
        REPO_TOO_LARGE: PackageX,
        RATE_LIMITED: Timer,
        QUEUE_FULL: Users,
        JOB_NOT_FOUND: Unlink,
        ANALYSIS_TIMEOUT: Hourglass,
        CHALLENGE_FAILED: ShieldX,
      } as Record<string, typeof Lock>
    )[failure.code] ?? CircleAlert
  );
}

export function FailureState({
  repo,
  reportHref,
  failure,
  failedAt,
  onRetry,
}: Props) {
  const copy = analyzeCopy(repo);
  const text = failureCopy(failure);
  const until = text.retryAfterSeconds
    ? failedAt + text.retryAfterSeconds * 1000
    : null;
  const left = useSecondsLeft(until);
  const icon = createElement(iconFor(failure), {
    size: 20,
    strokeWidth: 1.5,
    "aria-hidden": true,
  });
  const code = failure.kind === "api" ? failure.code : null;
  const fieldError = code !== null && FIELD_CODES.has(code);

  return (
    <section className="panel grid max-w-[640px] gap-3.5 p-6" role="alert">
      <span className="grid size-10 place-items-center rounded-full bg-blush text-garnet">
        {icon}
      </span>
      <h2 className="text-lg font-bold">{text.title}</h2>
      <p className="text-[15px] text-ink-2">{text.detail}</p>
      {fieldError ? (
        <div className="mt-2">
          <RepoField
            initialValue={code === "REPO_TOO_LARGE" ? "" : repo}
            label={copy.anotherRepo}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {code === "JOB_NOT_FOUND" && (
            <ButtonLink href={reportHref} size="sm">
              {copy.openReport}
            </ButtonLink>
          )}
          <Button
            size="sm"
            variant={code === "JOB_NOT_FOUND" ? "line" : "primary"}
            disabled={left > 0}
            onClick={onRetry}
          >
            {left > 0 ? (
              <span className="num">{copy.availableIn(formatClock(left))}</span>
            ) : (
              <>
                <RotateCcw size={15} strokeWidth={1.5} aria-hidden />
                {code === "JOB_NOT_FOUND" || code === "ANALYSIS_TIMEOUT"
                  ? copy.runAgain
                  : copy.tryAgain}
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
