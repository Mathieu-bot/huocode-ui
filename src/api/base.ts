import { AnalysisApi, ReportsApi } from "@/api-client/api";
import { Configuration } from "@/api-client/configuration";

const DEV_FALLBACK = "http://localhost:8080";

function resolveBasePath(): string {
  const configured = process.env.NEXT_PUBLIC_HUO_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_HUO_API_URL is not set. The app cannot reach the API.",
    );
  }
  return DEV_FALLBACK;
}

const configuration = new Configuration({ basePath: resolveBasePath() });

export const analysisApi = new AnalysisApi(configuration);
export const reportsApi = new ReportsApi(configuration);
