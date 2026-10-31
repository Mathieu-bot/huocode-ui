import type {
  AnalysisResult,
  ListReportFiles200Response,
  ListReportFilesSortEnum,
  ListReportFilesStatusEnum,
} from "@/api-client/api";
import { reportsApi } from "@/api/base";

export async function fetchReport(
  owner: string,
  repo: string,
): Promise<AnalysisResult> {
  const { data } = await reportsApi.getPublicReport(owner, repo);
  return data;
}

export type ReportFileQuery = {
  page?: number;
  pageSize?: number;
  sort?: ListReportFilesSortEnum;
  status?: ListReportFilesStatusEnum;
};

export async function fetchReportFiles(
  owner: string,
  repo: string,
  query: ReportFileQuery = {},
): Promise<ListReportFiles200Response> {
  const { data } = await reportsApi.listReportFiles(
    owner,
    repo,
    query.page,
    query.pageSize,
    query.sort,
    query.status,
  );
  return data;
}

export async function fetchExamples() {
  const { data } = await reportsApi.getExampleRepos();
  return data;
}
