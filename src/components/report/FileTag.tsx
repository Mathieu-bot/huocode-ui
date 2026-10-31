"use client";

import {
  Check,
  ExternalLink,
  EyeOff,
  FlaskConical,
  ListTree,
  Pin,
  Sparkle,
} from "lucide-react";
import type { FileResult } from "@/api-client/api";
import { Button } from "@/components/ui/Button";
import {
  ACTIONS,
  BAND_LABEL,
  explain,
  FILE_ERROR,
  languageName,
} from "@/copy/report";
import { band, splitPath } from "@/lib/report";
import { FileChips } from "./FileChips";
import { FileMetrics } from "./FileMetrics";
import { useReportContext } from "./ReportContext";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;
const BAND_TEXT = { ok: "text-ok", warn: "text-warn", crit: "text-crit" };

/** Detail panel for one file. `compact` drops the next steps and offers a jump to Files. */
export function FileTag({
  file,
  compact = false,
}: {
  file: FileResult;
  compact?: boolean;
}) {
  const { report, goTab } = useReportContext();
  const { dir, name } = splitPath(file.path);
  const analyzed = file.status === "analyzed";
  const score = file.codeHealthScore;
  const narration = analyzed ? explain(file) : null;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[1fr_auto] items-start gap-2.5">
        <div className="min-w-0">
          <div className="font-mono text-lg font-semibold break-all">
            {name}
          </div>
          <div className="font-mono text-[12.5px] break-all text-ink-3">
            {dir || "repository root"}
          </div>
          <FileChips file={file} className="mt-2" />
        </div>
        {file.quadrant === "hotspot" && !file.isTest && (
          <Pin
            size={18}
            strokeWidth={1.5}
            className="text-garnet"
            aria-label="Hotspot"
          />
        )}
      </div>

      {!analyzed && (
        <p className="flex items-start gap-2.5 rounded-[10px] border border-dashed border-seam-strong p-3.5 text-sm text-ink-2">
          <EyeOff {...icon} className="mt-0.5 shrink-0" />
          {file.status === "error"
            ? `${FILE_ERROR[file.errorCode ?? ""] ?? FILE_ERROR.PARSE_ERROR}. `
            : `${languageName(file.unsupportedLanguage)} isn't read yet: HuoCode reads Java only for now. `}
          Not analyzed doesn&apos;t mean low risk.
        </p>
      )}

      {analyzed && score !== undefined && (
        <div className="flex items-center gap-3.5 rounded-[10px] border border-seam bg-toile px-4 py-3.5">
          <span
            className={`text-[50px] leading-none font-bold tracking-[-0.02em] tabular-nums ${BAND_TEXT[band(score)]}`}
          >
            {score}
          </span>
          <span>
            <span className={`block font-bold ${BAND_TEXT[band(score)]}`}>
              {BAND_LABEL[band(score)]}
            </span>
            <span className="block text-[13px] text-ink-2">
              {file.isTest ? (
                <span className="inline-flex items-center gap-1">
                  <FlaskConical {...icon} />
                  Test file: not counted in the repository score
                </span>
              ) : (
                "File health, out of 100"
              )}
            </span>
          </span>
        </div>
      )}

      {narration && <p className="text-[15px]">{narration}</p>}

      {analyzed && <FileMetrics file={file} />}

      {!compact && file.quadrant && (
        <div className="grid gap-2.5">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkle {...icon} />
            Suggested next steps
          </h2>
          <ul className="grid gap-2 text-sm text-ink-2">
            {ACTIONS[file.quadrant].map((action) => (
              <li key={action} className="flex items-start gap-2">
                <Check {...icon} className="mt-0.5 shrink-0 text-garnet" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <a
          className="inline-flex h-9 items-center gap-2 rounded-full border border-seam-strong bg-linen px-3.5 text-sm font-semibold no-underline hover:border-ink"
          href={`https://github.com/${report.repo}/blob/${report.commitSha}/${file.path}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink {...icon} />
          Open on GitHub
        </a>
        {compact && (
          <Button size="sm" onClick={() => goTab("files")}>
            <ListTree {...icon} />
            See in Files
          </Button>
        )}
      </div>
    </div>
  );
}
