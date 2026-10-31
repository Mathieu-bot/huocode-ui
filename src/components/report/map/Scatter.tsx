import type { FileResult, Quadrant } from "@/api-client/api";
import { mapCopy } from "@/copy/map";
import { complexitySeam, jitter } from "@/lib/treemap";
import { ScatterAxes } from "./ScatterAxes";
import { onActivate } from "./keys";
import { fillFor, isDimmed } from "./paint";

type Props = {
  files: FileResult[];
  width: number;
  selected: string | null;
  focus: Quadrant | null;
  onSelect: (path: string) => void;
};

export const scatterHeight = (w: number) =>
  Math.round(Math.max(320, Math.min(540, w * 0.58)));

/** Change activity (x) against complexity (y), both ranked within the repository. */
export function Scatter({ files, width, selected, focus, onSelect }: Props) {
  const height = scatterHeight(width);
  const m = { l: 46, r: 18, t: 16, b: 44 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const X = (v: number) => m.l + (v / 100) * iw;
  const Y = (v: number) => m.t + ih - (v / 100) * ih;
  const seam = complexitySeam(files);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="group"
      aria-label={mapCopy.scatterLabel}
      className="block h-auto w-full"
    >
      <ScatterAxes width={width} height={height} m={m} X={X} Y={Y} />
      {seam !== null && (
        <g pointerEvents="none">
          <line
            x1={m.l}
            x2={m.l + iw}
            y1={Y(seam)}
            y2={Y(seam)}
            strokeDasharray="6 4"
            style={{ stroke: "var(--garnet)" }}
          />
          <text
            x={m.l + 6}
            y={Y(seam) - 7}
            className="font-mono text-xs"
            style={{ fill: "var(--garnet-deep)" }}
          >
            {mapCopy.seam}
          </text>
        </g>
      )}
      {files.map((file, i) => {
        if (
          file.status !== "analyzed" ||
          file.churnPercentile === undefined ||
          file.complexityPercentile === undefined
        )
          return null;
        const { dx, dy } = jitter(i);
        const sel = file.path === selected;
        const dim = isDimmed(file, focus);
        return (
          <circle
            key={file.path}
            data-path={file.path}
            cx={X(file.churnPercentile) + dx}
            cy={Y(file.complexityPercentile) + dy}
            r={sel ? 9 : 6.5}
            tabIndex={0}
            role="button"
            aria-label={file.path}
            aria-pressed={sel}
            onClick={() => onSelect(file.path)}
            onKeyDown={onActivate(() => onSelect(file.path))}
            className="cursor-pointer transition-opacity duration-[250ms] outline-none focus-visible:stroke-garnet focus-visible:[stroke-width:3]"
            style={{
              fill: fillFor(file),
              fillOpacity: dim ? 0.15 : 0.82,
              stroke: sel ? "var(--ink)" : "#fff",
              strokeWidth: sel ? 2.5 : 1.2,
            }}
          />
        );
      })}
    </svg>
  );
}
