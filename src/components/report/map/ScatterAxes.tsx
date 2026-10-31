import { mapCopy } from "@/copy/map";

type Props = {
  width: number;
  height: number;
  m: { l: number; r: number; t: number; b: number };
  X: (v: number) => number;
  Y: (v: number) => number;
};

const TICKS = [0, 25, 50, 75, 100];

/** Light grid and plain-word axis labels for the scatter. */
export function ScatterAxes({ width, height, m, X, Y }: Props) {
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const small = width < 460 ? "text-[10.5px]" : "text-xs";
  return (
    <g pointerEvents="none" aria-hidden>
      {TICKS.map((v) => (
        <g key={v} style={{ stroke: "var(--chalk-soft)" }}>
          <line x1={X(v)} x2={X(v)} y1={m.t} y2={m.t + ih} />
          <line x1={m.l} x2={m.l + iw} y1={Y(v)} y2={Y(v)} />
        </g>
      ))}
      <g className={`font-mono ${small}`} style={{ fill: "var(--ink-2)" }}>
        <text x={m.l} y={height - 24}>
          {mapCopy.leastChanged}
        </text>
        <text x={m.l + iw} y={height - 24} textAnchor="end">
          {mapCopy.mostChanged}
        </text>
      </g>
      <g className={`font-mono ${small}`} style={{ fill: "var(--ink)" }}>
        <text x={m.l + iw / 2} y={height - 6} textAnchor="middle">
          {mapCopy.xAxis}
        </text>
        <text
          transform={`translate(16 ${m.t + ih / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          {mapCopy.yAxis}
        </text>
      </g>
    </g>
  );
}
