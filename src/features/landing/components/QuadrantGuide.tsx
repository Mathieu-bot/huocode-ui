import { landingCopy } from "../copy";
import { QUADRANT_ORDER, quadrantCopy } from "@/shared/copy/quadrants";

export function QuadrantGuide() {
  return (
    <section aria-labelledby="quadrant-guide" className="mt-14">
      <h2 id="quadrant-guide" className="sr-only">
        {landingCopy().previewLabel}
      </h2>
      <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-0.5 text-sm text-ink-2">{copy.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
