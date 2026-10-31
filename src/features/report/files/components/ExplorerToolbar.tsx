import { ArrowDownWideNarrow, FolderTree, Search } from "lucide-react";
import type { Ref } from "react";
import { GlideGroup } from "@/shared/ui/GlideGroup";
import { filesCopy } from "../copy";

export type Arrange = "folders" | "risk";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

type Props = {
  searchRef: Ref<HTMLInputElement>;
  query: string;
  onQuery: (query: string) => void;
  arrange: Arrange;
  onArrange: (arrange: Arrange) => void;
  /** False on small repositories: files have no score, only a complexity. */
  scored: boolean;
};

export function ExplorerToolbar({
  searchRef,
  query,
  onQuery,
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
      <div className="flex flex-wrap items-center justify-end gap-2">
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
