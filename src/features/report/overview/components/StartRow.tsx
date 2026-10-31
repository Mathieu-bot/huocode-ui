"use client";

import { ChevronRight, Sparkle } from "lucide-react";
import type { FileResult } from "@/api-client/api";
import { ACTIONS, BAND_LABEL, explain } from "../../copy";
import { band, splitPath } from "../../model";
import { FileChips } from "../../file-detail/FileChips";
import { useReportContext } from "../../shell/ReportContext";
import { icon } from "./ScorePanel";

const BAND_TEXT = { ok: "text-ok", warn: "text-warn", crit: "text-crit" };

export function StartRow({ file, rank }: { file: FileResult; rank: number }) {
  const { select, goTab } = useReportContext();
  const { dir, name } = splitPath(file.path);
  const score = file.codeHealthScore;
  const action = file.quadrant ? ACTIONS[file.quadrant][0] : null;
  const why = explain(file);
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          select(file.path);
          goTab("files");
        }}
        className="group grid w-full cursor-pointer grid-cols-[30px_minmax(0,1fr)_72px] items-start gap-[18px] rounded-[10px] border border-seam-strong bg-linen px-[18px] py-4 text-left transition-[border-color,box-shadow] duration-200 hover:border-ink hover:shadow-[0_10px_24px_-18px_rgb(43_27_48/.55)] sm:grid-cols-[34px_minmax(0,1.25fr)_96px_minmax(0,1.75fr)_22px]"
      >
        <span className="text-[22px] leading-[1.1] text-ink-3 tabular-nums">
          {rank}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[15px] font-semibold break-all">
            {name}
          </span>
          {dir && (
            <span className="block font-mono text-[12.5px] break-all text-ink-3">
              {dir}
            </span>
          )}
          <FileChips file={file} className="mt-2" />
        </span>
        <span
          className={`text-[34px] leading-none font-semibold tabular-nums ${score !== undefined ? BAND_TEXT[band(score)] : "text-ink-3"}`}
        >
          {score ?? "—"}
          {score !== undefined && (
            <small className="mt-1.5 block text-[12.5px] font-semibold">
              {BAND_LABEL[band(score)]}
            </small>
          )}
        </span>
        <span className="col-span-2 col-start-2 text-[14.5px] sm:col-span-1 sm:col-start-auto">
          {why}
          {action && (
            <span className="mt-2 flex items-start gap-1.5 text-[13.5px] text-ink-2">
              <Sparkle {...icon} className="mt-0.5 shrink-0 text-garnet" />
              {action}
            </span>
          )}
        </span>
        <span className="hidden pt-1 text-ink-3 group-hover:text-garnet sm:block">
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
        </span>
      </button>
    </li>
  );
}
