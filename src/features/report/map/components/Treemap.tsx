import type { ViewFilter } from "../../model";
import type { FileResult } from "@/api-client/api";
import { mapCopy } from "../copy";
import { layoutTreemap, mapHeight, truncateStart } from "../layout";
import { onActivate } from "./keys";
import { MapDefs } from "./MapDefs";
import { TreemapCell } from "./TreemapCell";

type Props = {
  files: FileResult[];
  width: number;
  dir: string | null;
  selected: string | null;
  focus: ViewFilter;
  onSelect: (path: string) => void;
  onZoom: (dir: string) => void;
};

/** Files grouped by folder, area by complexity. Folder labels zoom in. */
export function Treemap({
  files,
  width,
  dir,
  selected,
  focus,
  onSelect,
  onZoom,
}: Props) {
  const height = mapHeight(width);
  const { groups, cells } = layoutTreemap(files, width, height, dir);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="group"
      aria-label={mapCopy.treemapLabel}
      className="block h-auto w-full"
    >
      <MapDefs />
      {groups.map((g) => {
        const gw = g.x1 - g.x0;
        const label = truncateStart(g.name, Math.floor((gw - 12) / 7.2));
        const zoomable = !dir && gw > 60;
        return (
          <g key={g.name}>
            <rect
              x={g.x0 + 0.5}
              y={g.y0 + 0.5}
              width={Math.max(0, gw - 1)}
              height={Math.max(0, g.y1 - g.y0 - 1)}
              rx={6}
              strokeDasharray="4 3"
              style={{ fill: "var(--linen)", stroke: "var(--chalk)" }}
            />
            {gw > 60 && (
              <text
                x={g.x0 + 8}
                y={g.y0 + 15}
                pointerEvents="none"
                className="font-mono text-xs"
                style={{ fill: "var(--ink-2)" }}
              >
                {label}
              </text>
            )}
            {zoomable && (
              <rect
                x={g.x0}
                y={g.y0}
                width={gw}
                height={20}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={mapCopy.zoomLabel(g.name)}
                onClick={() => onZoom(g.name)}
                onKeyDown={onActivate(() => onZoom(g.name))}
                className="cursor-zoom-in outline-none focus-visible:stroke-garnet focus-visible:[stroke-width:2]"
              >
                <title>{mapCopy.zoomTitle(g.name, g.count)}</title>
              </rect>
            )}
          </g>
        );
      })}
      {cells.map((cell) => (
        <TreemapCell
          key={cell.file.path}
          cell={cell}
          selected={cell.file.path === selected}
          focus={focus}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
}
