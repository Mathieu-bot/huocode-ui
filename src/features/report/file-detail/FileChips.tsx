import { FlaskConical } from "lucide-react";
import type { FileResult } from "@/api-client/api";
import { Chip } from "@/shared/ui/Chip";
import { quadrantCopy } from "@/shared/copy/quadrants";
import { languageName, reportCopy } from "../copy";
import { fileKind, KIND_COLOR } from "../model";

export function FileChips({
  file,
  className = "",
}: {
  file: FileResult;
  className?: string;
}) {
  const kind = fileKind(file);
  return (
    <span className={`flex flex-wrap gap-1.5 ${className}`}>
      {file.status === "unsupported_language" && (
        <Chip hatched>
          {reportCopy.notAnalyzed(languageName(file.unsupportedLanguage))}
        </Chip>
      )}
      {file.status === "error" && (
        <Chip hatched>{reportCopy.couldNotRead}</Chip>
      )}
      {file.status === "analyzed" && file.quadrant && (
        <Chip swatch={quadrantCopy(file.quadrant).color}>
          {quadrantCopy(file.quadrant).label}
        </Chip>
      )}
      {file.status === "analyzed" && !file.quadrant && (
        <Chip
          swatch={
            KIND_COLOR[
              file.exceedsCommonComplexityThreshold ? "over" : "within"
            ]
          }
        >
          {file.exceedsCommonComplexityThreshold
            ? reportCopy.overLimit
            : reportCopy.withinLimit}
        </Chip>
      )}
      {kind === "test" && (
        <Chip tone="test">
          <FlaskConical size={14} strokeWidth={1.5} aria-hidden />
          {reportCopy.test}
        </Chip>
      )}
    </span>
  );
}
