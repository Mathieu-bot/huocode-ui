import { ChevronDown, Folder, FolderOpen } from "lucide-react";
import type { FileResult } from "@/api-client/api";
import { type FolderGroup, kindMix } from "@/lib/fileFilters";
import { isHatched, KIND_COLOR } from "@/lib/report";
import { FileRow } from "./FileRow";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

export type RowProps = {
  selected: string | null;
  /** Path of the row reachable with Tab: the selection, else the first row. */
  tabbable: string | null;
  onSelect: (path: string) => void;
};

function KindMix({ files }: { files: FileResult[] }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-1.5 w-[54px] overflow-hidden rounded-[3px] bg-seam"
    >
      {kindMix(files).map(({ kind, share }) => (
        <i
          key={kind}
          className="block h-full"
          style={{
            width: `${share * 100}%`,
            background: isHatched(kind)
              ? KIND_COLOR.unsupported
              : KIND_COLOR[kind],
          }}
        />
      ))}
    </span>
  );
}

function FolderBlock({
  group,
  open,
  onToggle,
  rows,
}: {
  group: FolderGroup;
  open: boolean;
  onToggle: (dir: string) => void;
  rows: RowProps;
}) {
  return (
    <div className="mt-1">
      <button
        type="button"
        aria-expanded={open}
        title={group.dir}
        onClick={() => onToggle(group.dir)}
        className="grid w-full cursor-pointer grid-cols-[16px_16px_minmax(0,1fr)_auto] items-center gap-[7px] rounded-lg p-2 text-left text-ink-2 hover:bg-toile hover:text-ink"
      >
        <span
          className={`inline-flex text-ink-3 transition-transform duration-200 motion-reduce:transition-none ${open ? "" : "-rotate-90"}`}
        >
          <ChevronDown {...icon} />
        </span>
        {open ? <FolderOpen {...icon} /> : <Folder {...icon} />}
        <span className="truncate text-left font-mono text-[12.5px] [direction:rtl]">
          <bdi className="[direction:ltr]">{group.dir}</bdi>
        </span>
        <span className="num inline-flex items-center gap-2 text-xs text-ink-3">
          <KindMix files={group.files} />
          {group.files.length}
        </span>
      </button>
      {open && (
        <ul role="group" aria-label={group.dir} className="pl-[22px]">
          {group.files.map((file) => (
            <FileRow
              key={file.path}
              file={file}
              flat={false}
              selected={file.path === rows.selected}
              tabbable={file.path === rows.tabbable}
              onSelect={rows.onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export function FolderTree({
  groups,
  isOpen,
  onToggle,
  rows,
}: {
  groups: FolderGroup[];
  isOpen: (dir: string) => boolean;
  onToggle: (dir: string) => void;
  rows: RowProps;
}) {
  return groups.map((group) => (
    <FolderBlock
      key={group.dir}
      group={group}
      open={isOpen(group.dir)}
      onToggle={onToggle}
      rows={rows}
    />
  ));
}

export function FlatList({
  files,
  rows,
}: {
  files: FileResult[];
  rows: RowProps;
}) {
  return (
    <ul>
      {files.map((file) => (
        <FileRow
          key={file.path}
          file={file}
          flat
          selected={file.path === rows.selected}
          tabbable={file.path === rows.tabbable}
          onSelect={rows.onSelect}
        />
      ))}
    </ul>
  );
}
