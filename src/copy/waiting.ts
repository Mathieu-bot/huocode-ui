export type WaitingCopy = {
  headline: string;
  detail: string;
  timeoutNotice: string;
  staleBadge: string;
};

export function waitingCopy(repo: string): WaitingCopy {
  return {
    headline: `Reading ${repo}`,
    detail:
      "Big repositories take a few minutes. You can leave this page and come back — the analysis keeps going without you.",
    timeoutNotice:
      "Very large repositories can take up to 15 minutes. If this has been running that long, the analysis will time out on its own.",
    staleBadge: "Earlier analysis",
  };
}

export function staleReportCopy(commitSha: string, analyzedAt: string): string {
  return `This is an earlier analysis — commit ${commitSha}, from ${analyzedAt}. We're refreshing it now.`;
}
