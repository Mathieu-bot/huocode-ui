import { QUADRANT_ORDER, quadrantCopy } from "@/copy/quadrants";

export function HowQuadrants() {
  return (
    <ul className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
      {QUADRANT_ORDER.map((quadrant) => {
        const copy = quadrantCopy(quadrant);
        return (
          <li
            key={quadrant}
            className="panel grid grid-cols-[46px_1fr] items-start gap-3.5 p-4"
          >
            <span
              className="pinked h-[54px] rounded-[2px]"
              style={{ background: copy.color }}
              aria-hidden
            />
            <div>
              <h3 className="text-base font-semibold">{copy.label}</h3>
              <p className="mt-0.5 text-sm text-ink-2">{copy.short}.</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
