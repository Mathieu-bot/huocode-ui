export function analyzeCopy(repo: string) {
  return {
    syncTitle: "Mapping the repository",
    failedTitle: "This repository couldn't be mapped",
    challengeHeading: "Almost there",
    steps: [
      "Fetching the files",
      "Reading the change history",
      "Measuring the code",
    ],
    stepDone: "done",
    stepNow: "in progress",
    syncFoot: "Usually under 20 seconds. The report opens by itself.",
    jobTitle: "A large repository, mapping in progress",
    elapsed: (estimate: number | null) =>
      estimate
        ? `elapsed · usually about ${formatDuration(estimate)}`
        : "elapsed",
    trackReceived: "Request received",
    trackRunning: "Measuring every file",
    trackReady: "Report ready, opens automatically",
    slow: "Taking longer than usual. Very large repositories can need up to 15 minutes. You can keep this page open or come back later.",
    closeTitle: "You can close this tab",
    closeBody:
      "The work keeps going. This link brings you back to it, or to the finished report.",
    copy: "Copy",
    copied: "Copied",
    titleHint: `When it's ready, this tab's title turns into ✓ ${repo}.`,
    readyTitle: `✓ ${repo} · HuoCode`,
    stoppedTitle: "Still running after 15 minutes",
    stoppedBody:
      "We stopped checking so this page doesn't wait forever. The mapping may still finish: check again in a moment.",
    checkAgain: "Check again",
    challengeTitle: "One quick check before we start",
    challengeBody: "The mapping starts as soon as the check passes.",
    challengeMissing:
      "The verification step isn't available right now. Try again in a moment.",
    tryAgain: "Try again",
    runAgain: "Run again",
    openReport: "Open the report",
    anotherRepo: "Try another repository",
    availableIn: (time: string) => `Available in ${time}`,
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.max(1, Math.round(seconds))} seconds`;
  }
  const minutes = Math.round(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
