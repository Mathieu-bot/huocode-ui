import type { AnalysisResult } from "@/api-client/api";
import { plural } from "@/copy/report";
import { toDate } from "@/lib/report";

export type Caveat = {
  kind: "languages" | "comparison" | "renamed";
  tone: "info" | "warn";
  title: string;
  body: string;
};

export const overviewCopy = {
  health: "Repository health",
  outOf: "/ 100",
  noScore: "No score",
  zones: [
    { label: "Critical under 50", color: "#e9a99f" },
    { label: "Needs attention 50–79", color: "#e8c77c" },
    { label: "Healthy 80+", color: "#a9c8a4" },
  ],
  matrixTitle: "Production files by group",
  matrixHint: "· click a group to list its files",
  moreComplex: "more complex",
  changesMore: "changes more",
  measuredTitle: "What was measured",
  browseAll: "Browse all files",
  startTitle: "Start here",
  commitsRead: "recent commits read",
  people: "people in that history",
  period: "period covered",
  windowOnly:
    "These results describe that window only; older history isn't counted.",
  howComputed: "How the score is computed",
  disclaimer:
    "This tool identifies areas to prioritize for human review, based on complexity and how much each file's lines changed. It is not a security audit, nor a guarantee of code reliability. For critical projects (finance, healthcare, infrastructure), manual review by experts and dedicated audit tools remain essential.",
  verdictHot: (count: number) => plural(count, "file is", "files are"),
  verdictHotRest: " both complex and changing a lot. Start there.",
  verdictCalm: "No file is both complex and changing a lot. Nothing urgent.",
  scoreFoot: (count: number) =>
    `Average of ${plural(count, "production file", "production files")}, weighted by size, compared within this repository only.`,
  tooFew: (count: number) =>
    `Too few Java files to compare (${count}). Scores rank files against each other, which needs at least 15.`,
  holdsAlone:
    "What still holds on its own: whether a file's most complex method goes over the common limit of 10.",
  overCount: (count: number) => `${plural(count, "file does", "files do")}.`,
  startIntro: (count: number) =>
    `The ${plural(count, "production file", "production files")} with the lowest health, worst first.`,
  testFiles: (count: number) =>
    `${plural(count, "test file", "test files")}, shown but not scored`,
  otherLanguages: (count: number) =>
    `${plural(count, "file", "files")} in other languages`,
  measured: {
    over: (count: number) =>
      `${plural(count, "file", "files")} with a method over the complexity limit`,
    within: (count: number) =>
      `${plural(count, "file", "files")} within the limit`,
    tests: (count: number) => plural(count, "test file", "test files"),
    notAnalyzed: (count: number) =>
      `${plural(count, "file", "files")} not analyzed`,
  },
};

const MONTH = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function month(value: Date | string | undefined): string | null {
  if (!value) return null;
  const date = toDate(value);
  return Number.isNaN(date.getTime()) ? null : MONTH.format(date);
}

/** "Mar 2024 – Oct 2026", one month when both ends match, null when unknown. */
export function periodLabel(
  from: Date | string | undefined,
  to: Date | string | undefined,
): string | null {
  const a = month(from);
  const b = month(to);
  if (!a || !b) return a ?? b;
  return a === b ? a : `${a} – ${b}`;
}

export function caveats(report: AnalysisResult): Caveat[] {
  const list: Caveat[] = (report.limitations ?? []).map((limitation) =>
    limitation.code === "UNSUPPORTED_LANGUAGE_FILES"
      ? {
          kind: "languages",
          tone: "info",
          title: `${limitation.fileCount ? plural(limitation.fileCount, "file", "files") : "Some files"} not analyzed.`,
          body: "Written in languages HuoCode doesn't read yet. Listed in Files, never counted as healthy.",
        }
      : {
          kind: "comparison",
          tone: "warn",
          title: "No comparison.",
          body: "Too few Java files for a reliable ranking, so there are no scores or groups.",
        },
  );
  if (report.strategy === "api_direct")
    list.push({
      kind: "renamed",
      tone: "info",
      title: "Renamed files.",
      body: "A file renamed recently may show less history than it really has.",
    });
  return list;
}
