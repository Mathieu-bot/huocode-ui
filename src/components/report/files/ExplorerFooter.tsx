import { filesCopy } from "@/copy/files";

const KBD =
  "rounded border border-b-2 border-seam-strong bg-linen px-[5px] font-mono text-[11.5px]";

export function ExplorerFooter({
  shown,
  total,
}: {
  shown: number;
  total: number;
}) {
  return (
    <div className="flex flex-wrap gap-3.5 border-t border-dashed border-chalk-soft px-3.5 py-2.5 text-[12.5px] text-ink-2">
      <span>
        <kbd className={KBD}>↑</kbd> <kbd className={KBD}>↓</kbd>{" "}
        {filesCopy.move}
      </span>
      <span>
        <kbd className={KBD}>/</kbd> {filesCopy.searchKey}
      </span>
      <span className="ml-auto" aria-live="polite">
        {filesCopy.shown(shown, total)}
      </span>
    </div>
  );
}
