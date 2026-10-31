"use client";

import { SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { filesCopy } from "../copy";
import {
  type FileFilter,
  filterCounts,
  folderGroups,
  visibleFiles,
} from "../filters";
import { useReportContext } from "../../shell/ReportContext";
import { type Arrange, ExplorerToolbar } from "./ExplorerToolbar";
import { ExplorerFooter } from "./ExplorerFooter";
import { FlatList, FolderTree } from "./FolderTree";
import {
  useArrowSelection,
  useRevealSelectedOnMount,
  useSlashToSearch,
} from "../hooks/useExplorerKeys";

export function Explorer({ className = "" }: { className?: string }) {
  const { report, selected, select, focus, setFocus } = useReportContext();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FileFilter>("all");
  const [arrange, setArrange] = useState<Arrange>("folders");
  const [closed, setClosed] = useState<Set<string>>(() => new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const files = report.files;
  const counts = useMemo(() => filterCounts(files), [files]);
  const shown = useMemo(
    () => visibleFiles(files, { filter, query, focus }),
    [files, filter, query, focus],
  );
  const groups = useMemo(() => folderGroups(shown), [shown]);
  // A search opens every folder so no match stays hidden.
  const isOpen = (dir: string) => query.trim() !== "" || !closed.has(dir);
  const order =
    arrange === "risk"
      ? shown
      : groups.filter((g) => isOpen(g.dir)).flatMap((g) => g.files);
  const tabbable = order.some((f) => f.path === selected)
    ? selected
    : (order[0]?.path ?? null);
  const rows = { selected, tabbable, onSelect: select };

  useSlashToSearch(searchRef);
  useRevealSelectedOnMount(listRef);
  const onKeyDown = useArrowSelection(listRef, selected, select);

  function toggle(dir: string) {
    setClosed((prev) => {
      const next = new Set(prev);
      if (!next.delete(dir)) next.add(dir);
      return next;
    });
  }
  function clearFilters() {
    setQuery("");
    setFilter("all");
    setFocus(null);
  }

  return (
    <section
      aria-label={filesCopy.panelLabel}
      onKeyDown={onKeyDown}
      className={`panel flex flex-col overflow-hidden ${className}`}
    >
      <ExplorerToolbar
        searchRef={searchRef}
        query={query}
        onQuery={setQuery}
        filter={filter}
        counts={counts}
        onFilter={setFilter}
        focus={focus}
        onClearFocus={() => setFocus(null)}
        arrange={arrange}
        onArrange={setArrange}
        scored={report.relativeScoringEnabled}
      />
      <div
        ref={listRef}
        role="listbox"
        aria-label={filesCopy.listLabel}
        className="flex-1 overflow-y-auto px-1.5 pt-1.5 pb-3.5"
      >
        {shown.length === 0 ? (
          <div className="grid justify-items-center gap-2.5 px-[18px] py-[30px] text-center text-ink-2">
            <SearchX size={22} strokeWidth={1.5} aria-hidden />
            <span>{filesCopy.empty}</span>
            <Button variant="line" size="sm" onClick={clearFilters}>
              {filesCopy.clear}
            </Button>
          </div>
        ) : arrange === "risk" ? (
          <FlatList files={shown} rows={rows} />
        ) : (
          <FolderTree
            groups={groups}
            isOpen={isOpen}
            onToggle={toggle}
            rows={rows}
          />
        )}
      </div>
      <ExplorerFooter shown={shown.length} total={files.length} />
    </section>
  );
}
