import type { AsyncFailureCode, FailureCode } from "@/api-client/api";
import type { ApiFailure } from "@/api/failures";

export type FailureCopy = {
  title: string;
  detail: string;
  retryAfterSeconds: number | null;
};

const CODE_COPY: Record<
  FailureCode | AsyncFailureCode,
  Omit<FailureCopy, "retryAfterSeconds">
> = {
  INVALID_REPO_URL: {
    title: "That doesn't look like a GitHub URL",
    detail:
      "We need the full address, like https://github.com/owner/repository.",
  },
  REPO_NOT_FOUND_OR_PRIVATE: {
    title: "We couldn't find that repository",
    detail:
      "Check the owner and repository name, and make sure the repository is public.",
  },
  REPO_TOO_LARGE: {
    title: "This repository is too big for us",
    detail:
      "We cap analysis at 3,000 readable files. Try a smaller repository.",
  },
  RATE_LIMITED: {
    title: "You've started a few analyses already",
    detail: "Give it a moment, then try again.",
  },
  QUEUE_FULL: {
    title: "We're busy right now",
    detail:
      "Other analyses are queued ahead of yours, so this one will take a little longer.",
  },
  JOB_NOT_FOUND: {
    title: "That analysis has expired",
    detail:
      "We only keep results for a while. Start the analysis again and we'll pick it up.",
  },
  GITHUB_RATE_LIMIT_REACHED: {
    title: "We hit GitHub's rate limit",
    detail:
      "Nothing is wrong with your repository. It's a temporary limit on our side, so it's worth trying again in a few minutes.",
  },
  REPORT_NOT_FOUND: {
    title: "We haven't analyzed that repository yet",
    detail: "Run the analysis first and the report will be waiting here.",
  },
  CHALLENGE_REQUIRED: {
    title: "One quick check first",
    detail:
      "We need to confirm you're not a robot before we start reading the code.",
  },
  CHALLENGE_FAILED: {
    title: "That check didn't go through",
    detail: "It's usually a second attempt that does it. Please try again.",
  },
  ANALYSIS_TIMEOUT: {
    title: "This one ran out of time",
    detail:
      "Very large repositories can do that. It's worth another go, and caching means a retry is quicker.",
  },
};

export function failureCopy(failure: ApiFailure): FailureCopy {
  if (failure.kind === "offline") {
    return {
      title: "We can't reach the server",
      detail:
        "Check your connection and try again. If it keeps happening, the API is probably down.",
      retryAfterSeconds: null,
    };
  }

  if (failure.kind === "http") {
    return {
      title: "The server sent us something unexpected",
      detail: "That's on our side, not your repository. Try again in a moment.",
      retryAfterSeconds: failure.retryAfterSeconds,
    };
  }

  return {
    ...CODE_COPY[failure.code],
    retryAfterSeconds: failure.retryAfterSeconds,
  };
}
