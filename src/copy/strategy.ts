import type { AnalysisResultStrategyEnum } from "@/api-client/api";

export type StrategyCopy = {
  label: string;
  detail: string;
};

const COPY: Record<AnalysisResultStrategyEnum, StrategyCopy> = {
  clone: {
    label: "Cloned",
    detail: "We cloned the repository to read its full history.",
  },
  api_direct: {
    label: "Read from the GitHub API",
    detail: "We pulled the files straight from the API, without cloning.",
  },
  cached: {
    label: "Saved result",
    detail:
      "This is a stored result for this exact commit, so it came back instantly.",
  },
};

export function strategyCopy(
  strategy: AnalysisResultStrategyEnum,
): StrategyCopy {
  return COPY[strategy];
}
