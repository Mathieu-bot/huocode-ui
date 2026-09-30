import type { AxiosError } from "axios";
import type { ErrorResponse, FailureCode } from "@/api-client/api";

export type ApiFailure =
  | { kind: "api"; code: FailureCode; retryAfterSeconds: number | null }
  | { kind: "http"; status: number; retryAfterSeconds: number | null }
  | { kind: "offline" };

const KNOWN_CODES = new Set<string>([
  "INVALID_REPO_URL",
  "REPO_NOT_FOUND_OR_PRIVATE",
  "REPO_TOO_LARGE",
  "RATE_LIMITED",
  "QUEUE_FULL",
  "JOB_NOT_FOUND",
  "GITHUB_RATE_LIMIT_REACHED",
  "REPORT_NOT_FOUND",
  "CHALLENGE_REQUIRED",
  "CHALLENGE_FAILED",
  "ANALYSIS_TIMEOUT",
]);

function readRetryAfter(error: AxiosError): number | null {
  const header = error.response?.headers?.["retry-after"];
  if (typeof header !== "string") {
    return null;
  }
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) ? seconds : null;
}

function readCode(error: AxiosError<ErrorResponse>): FailureCode | null {
  const code = error.response?.data?.code;
  if (typeof code === "string" && KNOWN_CODES.has(code)) {
    return code as FailureCode;
  }
  return null;
}

export function toApiFailure(error: unknown): ApiFailure {
  const axiosError = error as AxiosError<ErrorResponse>;

  if (!axiosError?.response) {
    return { kind: "offline" };
  }

  const retryAfterSeconds = readRetryAfter(axiosError);
  const code = readCode(axiosError);

  if (code) {
    return { kind: "api", code, retryAfterSeconds };
  }

  return {
    kind: "http",
    status: axiosError.response.status,
    retryAfterSeconds,
  };
}
