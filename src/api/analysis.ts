import { analysisApi } from "@/api/base";
import type { JobPoll, SubmitOutcome } from "@/api/outcomes";
import { toJobPoll, toSubmitOutcome } from "@/api/outcomes";

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
