import { FileX, FlaskConical, Pin } from "lucide-react";
import type { FileResult } from "@/api-client/api";
import { filesCopy } from "@/copy/files";
import {
  band,
  fileKind,
  isAnalyzed,
  isHatched,
  KIND_COLOR,
  splitPath,
} from "@/lib/report";

const icon = { size: 14, strokeWidth: 1.5 } as const;
const BAND_TEXT = { ok: "text-ok", warn: "text-warn", crit: "text-crit" };

function RowValue({ file }: { file: FileResult }) {
  const score = file.codeHealthScore;
  const value =
    score ?? (isAnalyzed(file) ? file.complexity : undefined) ?? "—";
  const tone =
    score !== undefined
      ? `font-semibold ${BAND_TEXT[band(score)]}`
      : "font-normal text-ink-3";
  return (
    <span className={`num min-w-[26px] text-right text-[13px] ${tone}`}>
      {value}
    </span>
  );
}

function RowMarks({ file }: { file: FileResult }) {
  return (
    <span className="inline-flex gap-1 text-ink-3">
      {file.quadrant === "hotspot" && !file.isTest && (
        <span className="inline-flex text-garnet" title={filesCopy.hotspot}>
          <Pin {...icon} aria-label={filesCopy.hotspot} />
        </span>
      )}
      {file.isTest && (
        <span className="inline-flex text-[#7c4dd8]" title={filesCopy.test}>
          <FlaskConical {...icon} aria-label={filesCopy.test} />
        </span>
      )}
      {file.status === "error" && (
        <span className="inline-flex" title={filesCopy.couldNotRead}>
          <FileX {...icon} aria-label={filesCopy.couldNotRead} />
        </span>
      )}
    </span>
  );
}

type Props = {
  file: FileResult;
  /** Flat list: show the folder under the name, no tree guide. */
  flat: boolean;
  selected: boolean;
  tabbable: boolean;
  onSelect: (path: string) => void;
};

export function FileRow({ file, flat, selected, tabbable, onSelect }: Props) {
  const { dir, name } = splitPath(file.path);
  const kind = fileKind(file);
  const guide = flat
    ? ""
    : "before:absolute before:inset-y-0 before:-left-3 before:border-l before:border-dashed before:border-chalk-soft";
  return (
    <li role="none">
      <button
        type="button"
        role="option"
        data-path={file.path}
        aria-selected={selected}
        tabIndex={tabbable ? 0 : -1}
        title={file.path}
        onClick={() => onSelect(file.path)}
        className={`relative grid w-full cursor-pointer grid-cols-[12px_minmax(0,1fr)_auto_auto] items-center gap-[9px] rounded-lg px-2.5 py-[7px] text-left ${guide} ${selected ? "bg-blush" : "hover:bg-toile"}`}
      >
        <span
          aria-hidden
          className={`size-3 rounded-[2px] ${isHatched(kind) ? "hatch" : ""}`}
          style={isHatched(kind) ? undefined : { background: KIND_COLOR[kind] }}
        />
        <span
          className={`truncate font-mono text-[13.5px] ${selected ? "text-garnet-deep" : ""}`}
        >
          {name}
          {flat && (
            <small className="block truncate text-[11.5px] text-ink-3">
              {dir || filesCopy.root}
            </small>
          )}
        </span>
        <RowMarks file={file} />
        <RowValue file={file} />
      </button>
    </li>
  );
}
