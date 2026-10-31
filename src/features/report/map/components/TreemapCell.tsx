import type { ViewFilter } from "../../model";
import { splitPath } from "../../model";
import { type CellBox, truncateEnd } from "../layout";
import { Pin } from "./MapDefs";
import { fillFor, isDimmed, isPinned, lightText } from "./paint";
import { onActivate } from "./keys";

type Props = {
  cell: CellBox;
  selected: boolean;
  focus: ViewFilter;
  onSelect: (path: string) => void;
};

/** One file in the treemap: flat fill, name and score when there is room. */
export function TreemapCell({ cell, selected, focus, onSelect }: Props) {
  const { file, x0, y0, x1, y1 } = cell;
  const w = Math.max(0, x1 - x0);
  const h = Math.max(0, y1 - y0);
  const dim = isDimmed(file, focus);
  const light = lightText(file);
  const name = splitPath(file.path).name.replace(/\.java$/, "");
  const showLabel = w > 56 && h > 22 && !dim;
  return (
    <g>
      <rect
        data-path={file.path}
        x={x0}
        y={y0}
        width={w}
        height={h}
        rx={2}
        tabIndex={0}
        role="button"
        aria-label={file.path}
        aria-pressed={selected}
        onClick={() => onSelect(file.path)}
        onKeyDown={onActivate(() => onSelect(file.path))}
        className="cursor-pointer transition-opacity duration-[250ms] outline-none hover:stroke-ink hover:[stroke-width:1.5] focus-visible:stroke-garnet focus-visible:[stroke-width:3]"
        style={{
          fill: fillFor(file),
          opacity: dim ? 0.15 : 1,
          ...(selected && { stroke: "var(--ink)", strokeWidth: 3 }),
        }}
      />
      {showLabel && (
        <text
          x={x0 + 6}
          y={y0 + 16}
          pointerEvents="none"
          className="font-mono text-[11.5px]"
          style={{ fill: light ? "#fff" : "var(--ink)" }}
        >
          {truncateEnd(name, Math.floor((w - 10) / 7))}
        </text>
      )}
      {showLabel && h > 38 && file.codeHealthScore !== undefined && (
        <text
          x={x0 + 6}
          y={y0 + 32}
          pointerEvents="none"
          className="font-mono text-[11.5px]"
          style={{ fill: light ? "rgba(255,255,255,.85)" : "var(--ink-2)" }}
        >
          {file.codeHealthScore}
        </text>
      )}
      {isPinned(file) && w > 18 && h > 18 && !dim && (
        <Pin x={x1 - 12} y={y0 + 11} />
      )}
    </g>
  );
}
