import { overviewCopy } from "@/copy/overview";

const LABELS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const TICKS = [
  "linear-gradient(90deg, rgb(43 27 48 / .55) 1px, transparent 1px) 0 0 / 10% 18px repeat-x",
  "linear-gradient(90deg, rgb(43 27 48 / .4) 1px, transparent 1px) 0 0 / 5% 11px repeat-x",
  "linear-gradient(90deg, rgb(43 27 48 / .25) 1px, transparent 1px) 0 0 / 1% 6px repeat-x",
].join(", ");
const ZONE_WIDTH = ["50%", "30%", "20%"];

/** Tape measure 0–100 with coloured zones and a pin at `value`. */
export function ScoreTape({ value }: { value: number }) {
  const zones = overviewCopy.zones;
  return (
    <>
      <div
        className="relative h-[46px] rounded-[3px] border border-blush-line bg-blush"
        aria-hidden
      >
        <div className="absolute inset-0" style={{ background: TICKS }} />
        {LABELS.map((v) => (
          <span
            key={v}
            className={`absolute top-[19px] font-mono text-xs text-ink-2 ${v % 20 ? "max-sm:hidden" : ""} ${
              v === 0
                ? "translate-x-[3px]"
                : v === 100
                  ? "-translate-x-[calc(100%+3px)]"
                  : "-translate-x-1/2"
            }`}
            style={{ left: `${v}%` }}
          >
            {v}
          </span>
        ))}
        <div className="absolute inset-x-0 bottom-0 flex h-1">
          {zones.map((zone, i) => (
            <i
              key={zone.label}
              style={{ width: ZONE_WIDTH[i], background: zone.color }}
            />
          ))}
        </div>
        <div
          className="absolute -top-2.5 -bottom-2.5 w-0.5 -translate-x-px bg-garnet"
          style={{ left: `${value}%` }}
        >
          <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f4a9bc,var(--garnet)_62%)] shadow-[0_1px_3px_rgb(0_0_0/.25)]" />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-[12.5px] text-ink-2">
        {zones.map((zone) => (
          <span key={zone.label} className="inline-flex items-center gap-1.5">
            <i
              className="inline-block h-1 w-3.5 rounded-[2px]"
              style={{ background: zone.color }}
            />
            {zone.label}
          </span>
        ))}
      </div>
    </>
  );
}
