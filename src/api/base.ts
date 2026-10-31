import axios from "axios";
import { AnalysisApi, ReportsApi } from "@/api-client/api";
import { Configuration } from "@/api-client/configuration";
import { resolveApiBase } from "./baseUrl";

const base = resolveApiBase(
  process.env.NEXT_PUBLIC_HUO_API_URL,
  process.env.NODE_ENV,
);

const client = axios.create();
if (!base.configured) {
  client.interceptors.request.use(() =>
    Promise.reject(new Error("The HuoCode API URL is not configured.")),
  );
}

const configuration = new Configuration({ basePath: base.basePath });

export const analysisApi = new AnalysisApi(configuration, undefined, client);
export const reportsApi = new ReportsApi(configuration, undefined, client);
