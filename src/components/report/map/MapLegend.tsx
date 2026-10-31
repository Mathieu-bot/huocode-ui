import { MousePointerClick } from "lucide-react";
import type { CSSProperties } from "react";
import { mapCopy } from "@/copy/map";
import { QUADRANT_ORDER, quadrantCopy } from "@/copy/quadrants";

/** Colour key under the map; small repositories show over/within the limit instead of groups. */
export function MapLegend({ relative }: { relative: boolean }) {
  const items: [string, string][] = relative
    ? QUADRANT_ORDER.map((q) => [quadrantCopy(q).color, quadrantCopy(q).label])
    : [
        ["var(--slate-dark)", mapCopy.legendOver],
        ["var(--slate)", mapCopy.legendWithin],
      ];
  const swatch = "inline-block size-[13px] rounded-[2px]";
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-ink-2">
      {items.map(([color, label]) => (
        <span key={label} className="inline-flex items-center gap-[7px]">
          <i
            className={`pinked ${swatch}`}
            style={{ background: color, "--z": "4px" } as CSSProperties}
          />
          {label}
        </span>
      ))}
      <span className="inline-flex items-center gap-[7px]">
        <i className={`${swatch} bg-q-test`} />
        {mapCopy.legendTest}
      </span>
      <span className="inline-flex items-center gap-[7px]">
        <i className={`hatch ${swatch}`} />
        {mapCopy.legendNotAnalyzed}
      </span>
      <span className="inline-flex items-center gap-[7px] text-ink-3 min-[641px]:ml-auto">
        <MousePointerClick size={15} strokeWidth={1.5} aria-hidden />
        {mapCopy.hint}
      </span>
    </div>
  );
}
