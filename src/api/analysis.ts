import { analysisApi } from "./base";
import type { JobPoll, SubmitOutcome } from "./outcomes";
import { toJobPoll, toSubmitOutcome } from "./outcomes";

export async function submitAnalysis(
  repoUrl: string,
  turnstileToken?: string,
): Promise<SubmitOutcome> {
  const { data } = await analysisApi.analyzeRepository({
    repoUrl,
    ...(turnstileToken ? { turnstileToken } : {}),
  });
  return toSubmitOutcome(data);
}

export async function fetchJob(jobId: string): Promise<JobPoll> {
  const { data } = await analysisApi.getAnalysisJob(jobId);
  return toJobPoll(data);
}
