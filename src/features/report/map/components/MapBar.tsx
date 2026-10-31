import { ChartScatter, Folders, Info, LayoutGrid } from "lucide-react";
import { GlideGroup } from "@/shared/ui/GlideGroup";
import { mapCopy } from "../copy";
import type { MapView } from "../hooks/useMapView";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

type Props = {
  view: MapView;
  onView: ((view: MapView) => void) | null;
  dir: string | null;
  onRoot: () => void;
};

/** Breadcrumb on the left, Treemap/Scatter switch on the right (when the scatter exists). */
export function MapBar({ view, onView, dir, onRoot }: Props) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex min-h-[30px] flex-wrap items-center gap-1.5 font-mono text-[13px] text-ink-2">
        {view === "scatter" ? (
          <span className="inline-flex items-center gap-1.5">
            <Info {...icon} />
            {mapCopy.scatterCrumb}
          </span>
        ) : dir ? (
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
      {onView && (
        <GlideGroup<MapView>
          variant="pill"
          label={mapCopy.viewLabel}
          value={view}
          onChange={onView}
          items={[
            {
              key: "treemap",
              label: mapCopy.treemap,
              icon: <LayoutGrid {...icon} />,
            },
            {
              key: "scatter",
              label: mapCopy.scatter,
              icon: <ChartScatter {...icon} />,
            },
          ]}
        />
      )}
    </div>
  );
}
