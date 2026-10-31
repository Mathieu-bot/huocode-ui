import type {
  AnalysisResult,
  AsyncFailureCode,
  JobAccepted,
  JobFailed,
} from "@/api-client/api";

export type SubmitOutcome =
  | { kind: "ready"; result: AnalysisResult }
  | { kind: "accepted"; job: JobAccepted };

export type JobPoll =
  | { kind: "processing" }
  | { kind: "ready"; result: AnalysisResult }
  | { kind: "failed"; code: AsyncFailureCode };

function isJobAccepted(body: unknown): body is JobAccepted {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as JobAccepted).jobId === "string"
  );
}

export function toSubmitOutcome(body: unknown): SubmitOutcome {
  return isJobAccepted(body)
    ? { kind: "accepted", job: body }
    : { kind: "ready", result: body as AnalysisResult };
}

export class UnexpectedPayloadError extends Error {
  constructor() {
    super("The server sent a response this client does not understand.");
    this.name = "UnexpectedPayloadError";
  }
}

export function toJobPoll(body: unknown): JobPoll {
  if (typeof body !== "object" || body === null) {
    throw new UnexpectedPayloadError();
  }
  const status = (body as { status?: unknown }).status;
  if (status === "processing") {
    return { kind: "processing" };
  }
  if (status === "failed") {
    return { kind: "failed", code: (body as JobFailed).errorCode };
  }
  if (status === "completed") {
    return { kind: "ready", result: body as AnalysisResult };
  }
  throw new UnexpectedPayloadError();
}
