import type { AnalysisResult, FileResult, Quadrant } from "@/api-client/api";

export type Band = "ok" | "warn" | "crit";
/** How a file is drawn: its quadrant, or a status that is never scored. */
export type FileKind =
  Quadrant | "test" | "over" | "within" | "unsupported" | "error";

export const KIND_COLOR: Record<FileKind, string> = {
  hotspot: "var(--q-hot)",
  complex_stable: "var(--q-cs)",
  frequent_simple: "var(--q-fs)",
  healthy: "var(--q-ok)",
  test: "var(--q-test)",
  over: "var(--slate-dark)",
  within: "var(--slate)",
  unsupported: "var(--q-none)",
  error: "var(--q-none)",
};

/** Kinds whose fill is dark enough for light text (checked in scripts/contrast.mjs). */
export const DARK_KINDS = new Set<FileKind>([
  "hotspot",
  "frequent_simple",
  "over",
]);

export function band(score: number): Band {
  return score >= 80 ? "ok" : score >= 50 ? "warn" : "crit";
}

export function fileKind(file: FileResult): FileKind {
  if (file.status === "unsupported_language") return "unsupported";
  if (file.status === "error") return "error";
  if (file.isTest) return "test";
  if (file.quadrant) return file.quadrant;
  return file.exceedsCommonComplexityThreshold ? "over" : "within";
}

export const isAnalyzed = (f: FileResult) => f.status === "analyzed";
export const isProduction = (f: FileResult) => isAnalyzed(f) && !f.isTest;
export const isHatched = (kind: FileKind) =>
  kind === "unsupported" || kind === "error";

export function linesChanged(file: FileResult): number {
  const churn = file.churn;
  if (!churn) return 0;
  return (
    churn.effectiveLines ?? (churn.linesAdded ?? 0) + (churn.linesDeleted ?? 0)
  );
}

export function splitPath(path: string): { dir: string; name: string } {
  const i = path.lastIndexOf("/");
  return i < 0
    ? { dir: "", name: path }
    : { dir: path.slice(0, i), name: path.slice(i + 1) };
}

/** Lower sorts first: worst score, then most complex; tests after production; unanalyzed last. */
export function riskRank(file: FileResult): number {
  if (!isAnalyzed(file)) return 1e9;
  const complexity = file.complexity ?? 0;
  const base =
    file.codeHealthScore !== undefined
      ? file.codeHealthScore * 1000 - complexity
      : -complexity;
  return base + (file.isTest ? 5e5 : 0);
}

export function byRisk(a: FileResult, b: FileResult): number {
  return riskRank(a) - riskRank(b) || a.path.localeCompare(b.path);
}

export function groupByDir(files: FileResult[]): Map<string, FileResult[]> {
  const groups = new Map<string, FileResult[]>();
  for (const file of files) {
    const dir = splitPath(file.path).dir || "(repository root)";
    const list = groups.get(dir) ?? [];
    list.push(file);
    groups.set(dir, list);
  }
  return groups;
}

export type ReportStats = {
  production: FileResult[];
  tests: FileResult[];
  unsupported: FileResult[];
  errors: FileResult[];
};

export function reportStats(report: AnalysisResult): ReportStats {
  const files = report.files;
  return {
    production: files.filter(isProduction),
    tests: files.filter((f) => isAnalyzed(f) && f.isTest),
    unsupported: files.filter((f) => f.status === "unsupported_language"),
    errors: files.filter((f) => f.status === "error"),
  };
}

/** The file selected when a report opens: the worst production file. */
export function defaultSelection(report: AnalysisResult): string | null {
  return report.top5[0] ?? [...report.files].sort(byRisk)[0]?.path ?? null;
}

export function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}
