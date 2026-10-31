import type { FileResult, Quadrant } from "@/api-client/api";
import {
  byRisk,
  type FileKind,
  fileKind,
  groupByDir,
  isAnalyzed,
  isProduction,
  riskRank,
} from "./report";

/** Which slice of the repository the Files explorer lists. */
export type FileFilter = "all" | "prod" | "test" | "other" | "error";

export const FILE_FILTERS: FileFilter[] = [
  "all",
  "prod",
  "test",
  "other",
  "error",
];

export type FilterState = {
  filter: FileFilter;
  /** Free text matched against the whole path, ignoring case. */
  query: string;
  /** Quadrant picked on the Overview matrix: only its production files. */
  focus: Quadrant | null;
};

const IN_FILTER: Record<FileFilter, (file: FileResult) => boolean> = {
  all: () => true,
  prod: isProduction,
  test: (f) => isAnalyzed(f) && f.isTest === true,
  other: (f) => f.status === "unsupported_language",
  error: (f) => f.status === "error",
};

export function matchesFilters(file: FileResult, state: FilterState): boolean {
  if (!IN_FILTER[state.filter](file)) return false;
  if (state.focus && !(isProduction(file) && file.quadrant === state.focus))
    return false;
  const query = state.query.trim().toLowerCase();
  return !query || file.path.toLowerCase().includes(query);
}

export function filterCounts(files: FileResult[]): Record<FileFilter, number> {
  const counts = { all: 0, prod: 0, test: 0, other: 0, error: 0 };
  for (const file of files)
    for (const key of FILE_FILTERS) if (IN_FILTER[key](file)) counts[key] += 1;
  return counts;
}

/** Every file that passes the filters, worst first. */
export function visibleFiles(
  files: FileResult[],
  state: FilterState,
): FileResult[] {
  return files.filter((f) => matchesFilters(f, state)).sort(byRisk);
}

export type FolderGroup = { dir: string; files: FileResult[] };

/** Files grouped by parent folder; folders ordered by their worst file. */
export function folderGroups(files: FileResult[]): FolderGroup[] {
  return [...groupByDir(files)]
    .map(([dir, list]) => ({ dir, files: [...list].sort(byRisk) }))
    .sort(
      (a, b) =>
        riskRank(a.files[0]) - riskRank(b.files[0]) ||
        a.dir.localeCompare(b.dir),
    );
}

const MIX_ORDER: FileKind[] = [
  "hotspot",
  "complex_stable",
  "frequent_simple",
  "healthy",
  "test",
  "over",
  "within",
  "unsupported",
];

export type MixPart = { kind: FileKind; share: number };

/** Share of each file kind in a folder, for its mini stacked bar. Errors count as unread. */
export function kindMix(files: FileResult[]): MixPart[] {
  const counts = new Map<FileKind, number>();
  for (const file of files) {
    const raw = fileKind(file);
    const kind = raw === "error" ? "unsupported" : raw;
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  return MIX_ORDER.filter((k) => counts.has(k)).map((kind) => ({
    kind,
    share: counts.get(kind)! / files.length,
  }));
}
