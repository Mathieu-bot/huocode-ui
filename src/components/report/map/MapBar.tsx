import { Folders } from "lucide-react";
import { mapCopy } from "@/copy/map";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

type Props = { dir: string | null; onRoot: () => void };

/** Breadcrumb above the map: all folders, or the folder zoomed into. */
export function MapBar({ dir, onRoot }: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex min-h-[30px] flex-wrap items-center gap-1.5 font-mono text-[13px] text-ink-2">
        {dir ? (
          <>
            <button
              type="button"
              onClick={onRoot}
              className="inline-flex cursor-pointer items-center gap-[5px] underline decoration-chalk"
            >
              <Folders {...icon} />
              {mapCopy.allFolders}
            </button>
            <span aria-hidden>/</span>
            <span className="break-all">{dir}</span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <Folders {...icon} />
            {mapCopy.allFolders}
          </span>
        )}
      </div>
    </div>
  );
}
