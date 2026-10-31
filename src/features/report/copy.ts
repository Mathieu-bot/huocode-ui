import type { FileResult, Quadrant } from "@/api-client/api";
import type { Band, FileScope } from "./model";
import { linesChanged } from "./model";

const nf = new Intl.NumberFormat("en-US");
export const fmt = (value: number) => nf.format(value);
export const plural = (value: number, one: string, many: string) =>
  `${fmt(value)} ${value === 1 ? one : many}`;

export const BAND_LABEL: Record<Band, string> = {
  ok: "Healthy",
  warn: "Needs attention",
  crit: "Critical",
};

export const ACTIONS: Record<Quadrant, string[]> = {
  hotspot: [
    "Have two people review the next change here.",
    "Consider splitting it into smaller, separately testable parts.",
    "Check its test coverage before refactoring.",
  ],
  complex_stable: [
    "No immediate action needed.",
    "Document how it works: if it starts changing more often, its complexity becomes a risk.",
  ],
  frequent_simple: [
    "Generally fine.",
    "Watch that its complexity doesn't creep up over future changes.",
  ],
  healthy: ["No action needed."],
};

const LANGUAGES: Record<string, string> = {
  markdown: "Markdown",
  yaml: "YAML",
  xml: "XML",
  json: "JSON",
  text: "Plain text",
  kotlin: "Kotlin",
  python: "Python",
  go: "Go",
  javascript: "JavaScript",
  typescript: "TypeScript",
  groovy: "Groovy",
  scala: "Scala",
  shell: "Shell",
  html: "HTML",
  css: "CSS",
  properties: "Properties",
  sql: "SQL",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  rust: "Rust",
  ruby: "Ruby",
  php: "PHP",
  unknown: "Unknown type",
};

export function languageName(code: string | undefined): string {
  if (!code) return LANGUAGES.unknown;
  return LANGUAGES[code.toLowerCase()] ?? code;
}

export const FILE_ERROR: Record<string, string> = {
  PARSE_ERROR: "Couldn't be read: syntax we can't parse",
  FILE_TOO_LARGE: "Too large to read (over 1 MB)",
};

/** One sentence built only from numbers the API sent. Calm files are not narrated. */
export function explain(file: FileResult): string | null {
  const cc = file.complexity ?? 0;
  const commits = file.churn?.commits ?? 0;
  const authors = file.churn?.authors ?? 0;
  const lines = fmt(linesChanged(file));
  const c = plural(commits, "commit", "commits");
  const a = plural(authors, "person", "people");
  switch (file.quadrant) {
    case "hotspot":
      return `Its most complex method scores ${cc}, ${(cc / 10).toFixed(1).replace(".0", "")}× the common limit of 10, and the file changed by ${lines} lines over ${c} from ${a}. A change here most needs a careful review.`;
    case "complex_stable":
      return `Its most complex method scores ${cc}, above the common limit of 10, but it changes less than the busiest files here (${lines} lines over ${c}). Low urgency while it stays this way.`;
    case "frequent_simple":
      return `One of the most changed files here, ${lines} lines over ${c} from ${a}, but its code stays simple (most complex method: ${cc}).`;
    case "healthy":
      return `Simple (most complex method: ${cc}) and not changing unusually often. Nothing to flag.`;
    default:
      return null;
  }
}

export const reportCopy = {
  tabs: { overview: "Overview", map: "Map", files: "Files" },
  tabsLabel: "Report sections",
  upToDate: "Up to date",
  mapped: (date: string) => `Mapped ${date}`,
  viewOnGithub: "View on GitHub",
  copyLink: "Copy link",
  copied: "Copied",
  mapAgain: "Map again",
  another: "Another repository",
  loading: "Opening the report",
  notMappedTitle: "This repository hasn't been mapped yet.",
  notMappedBody:
    "It takes about 20 seconds. Once it's done, this link shows the report to anyone you share it with.",
  mapIt: (repo: string) => `Map ${repo}`,
  retry: "Try again",
  test: "Test",
  notAnalyzed: (language: string) => `Not analyzed · ${language}`,
  couldNotRead: "Couldn't read",
  overLimit: "Method over 10",
  withinLimit: "Within the limit",
};

export const SCOPE_LABEL: Record<FileScope, string> = {
  all: "All files",
  prod: "Production",
  test: "Tests",
  other: "Other languages",
  error: "Couldn't read",
};

export const filtersCopy = {
  button: "Filters",
  panelLabel: "Filter the map and the file list",
  show: "Show",
  group: "Group",
  anyGroup: "Every group",
  applies:
    "Applies to Map and Files. The overview always covers the whole repository.",
  clear: "Clear filters",
  done: "Done",
  remove: (label: string) => `Remove the ${label} filter`,
  noticeLead: "Filters are on in Map and Files:",
  noticeTail: "This summary still covers the whole repository.",
};
