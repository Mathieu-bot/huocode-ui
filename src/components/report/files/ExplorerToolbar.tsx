import { ArrowDownWideNarrow, FolderTree, Search, X } from "lucide-react";
import type { Ref } from "react";
import type { Quadrant } from "@/api-client/api";
import { Chip } from "@/components/ui/Chip";
import { GlideGroup } from "@/components/ui/GlideGroup";
import { FILTER_LABEL, filesCopy } from "@/copy/files";
import { quadrantCopy } from "@/copy/quadrants";
import { FILE_FILTERS, type FileFilter } from "@/lib/fileFilters";

export type Arrange = "folders" | "risk";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

type Props = {
  searchRef: Ref<HTMLInputElement>;
  query: string;
  onQuery: (query: string) => void;
  filter: FileFilter;
  counts: Record<FileFilter, number>;
  onFilter: (filter: FileFilter) => void;
  focus: Quadrant | null;
  onClearFocus: () => void;
  arrange: Arrange;
  onArrange: (arrange: Arrange) => void;
  /** False on small repositories: files have no score, only a complexity. */
  scored: boolean;
};

function FilterChips({
  filter,
  counts,
  onFilter,
}: Pick<Props, "filter" | "counts" | "onFilter">) {
  return (
    <div
      role="group"
      aria-label={filesCopy.filtersLabel}
      className="flex flex-wrap gap-1.5"
    >
      {FILE_FILTERS.map((key) => {
        const on = key === filter;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={on}
            disabled={key !== "all" && counts[key] === 0}
            onClick={() => onFilter(key)}
            className={`inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-full border px-[11px] text-[13px] font-semibold disabled:cursor-default disabled:opacity-50 ${on ? "border-ink bg-ink text-on-dark" : "border-seam-strong bg-linen text-ink"}`}
          >
            {FILTER_LABEL[key]}
            <span
              className={`num font-medium ${on ? "text-[#d9c9d2]" : "text-ink-3"}`}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FocusPill({
  focus,
  onClear,
}: {
  focus: Quadrant;
  onClear: () => void;
}) {
  const copy = quadrantCopy(focus);
  return (
    <div className="flex items-center gap-1 text-[13px]">
      <Chip swatch={copy.color}>{filesCopy.focusOnly(copy.label)}</Chip>
      <button
        type="button"
        onClick={onClear}
        aria-label={filesCopy.clearFocus}
        title={filesCopy.clearFocus}
        className="inline-flex cursor-pointer rounded-full p-1 text-ink-2 hover:bg-toile hover:text-ink"
      >
        <X {...icon} />
      </button>
    </div>
  );
}

export function ExplorerToolbar({
  searchRef,
  query,
  onQuery,
  filter,
  counts,
  onFilter,
  focus,
  onClearFocus,
  arrange,
  onArrange,
  scored,
}: Props) {
  return (
    <div className="grid gap-2.5 border-b border-dashed border-chalk-soft p-3.5">
      <label className="flex h-10 items-center gap-2 rounded-full border border-seam-strong bg-toile px-3.5 text-ink-3 focus-within:border-garnet focus-within:shadow-[0_0_0_3px_var(--blush)]">
        <Search {...icon} />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={filesCopy.search}
          aria-label={filesCopy.searchLabel}
          className="w-full border-0 bg-transparent font-mono text-[13.5px] text-ink outline-none placeholder:text-ink-3 focus-visible:outline-none"
        />
      </label>
      <FilterChips filter={filter} counts={counts} onFilter={onFilter} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        {focus ? <FocusPill focus={focus} onClear={onClearFocus} /> : <span />}
        <GlideGroup<Arrange>
          label={filesCopy.arrangeLabel}
          value={arrange}
          onChange={onArrange}
          items={[
            {
              key: "folders",
              label: filesCopy.folders,
              icon: <FolderTree {...icon} />,
            },
            {
              key: "risk",
              label: scored ? filesCopy.worstFirst : filesCopy.mostComplex,
              icon: <ArrowDownWideNarrow {...icon} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
