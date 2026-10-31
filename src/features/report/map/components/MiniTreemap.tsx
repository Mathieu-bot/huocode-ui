import type { FileResult } from "@/api-client/api";
import { layoutTreemap } from "../layout";
import { MapDefs, Pin } from "./MapDefs";
import { fillFor, isPinned } from "./paint";

const WIDTH = 520;
const HEIGHT = 340;

/** A static, decorative treemap: the same layout and colours as the Map tab, no interaction. */
export function MiniTreemap({
  files,
  label,
}: {
  files: FileResult[];
  label: string;
}) {
  const { groups, cells } = layoutTreemap(files, WIDTH, HEIGHT);
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full"
    >
      <MapDefs />
      {groups.map((g) => (
        <rect
          key={g.name}
          x={g.x0 + 0.5}
          y={g.y0 + 0.5}
          width={Math.max(0, g.x1 - g.x0 - 1)}
          height={Math.max(0, g.y1 - g.y0 - 1)}
          rx={6}
          fill="var(--linen)"
          stroke="var(--chalk)"
          strokeDasharray="4 3"
        />
      ))}
      {cells.map(({ file, x0, y0, x1, y1 }) => (
        <g key={file.path}>
          <rect
            x={x0}
            y={y0}
            width={Math.max(0, x1 - x0)}
            height={Math.max(0, y1 - y0)}
            rx={2}
            fill={fillFor(file)}
          />
          {isPinned(file) && x1 - x0 > 18 && y1 - y0 > 18 && (
            <Pin x={x1 - 12} y={y0 + 11} />
          )}
        </g>
      ))}
    </svg>
  );
}
