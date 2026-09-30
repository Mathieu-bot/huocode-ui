import type { Limitation } from "@/api-client/api";

export type LimitationCopy = {
  tone: "note" | "caveat";
  text: string;
};

const TEXT: Record<Limitation["code"], (fileCount?: number) => string> = {
  UNSUPPORTED_LANGUAGE_FILES: (fileCount) =>
    fileCount
      ? `${fileCount} ${fileCount === 1 ? "file uses" : "files use"} a language we don't measure yet. They're left out of the score, so the real picture is slightly worse than this.`
      : "Some files use a language we don't measure yet, so they're left out of the score.",
  INSUFFICIENT_FILES_FOR_RELATIVE_SCORING: () =>
    "There's not enough here to rank files fairly against each other, so we're showing raw complexity instead of a score.",
};

export function limitationCopy(limitation: Limitation): LimitationCopy {
  const text = TEXT[limitation.code](limitation.fileCount);
  const tone =
    limitation.code === "UNSUPPORTED_LANGUAGE_FILES" ? "caveat" : "note";
  return { tone, text };
}
