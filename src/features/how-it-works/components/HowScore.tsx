import { CircleCheck, Eye, Flame, type LucideIcon } from "lucide-react";
import type { HowBand, HowCopy } from "../copy";

const TONE: Record<HowBand["tone"], { icon: LucideIcon; text: string }> = {
  ok: { icon: CircleCheck, text: "text-ok" },
  warn: { icon: Eye, text: "text-warn" },
  crit: { icon: Flame, text: "text-crit" },
};

type Props = { score: HowCopy["score"]; bands: HowBand[] };

export function HowScore({ score, bands }: Props) {
  return (
    <>
      <pre className="mt-3.5 overflow-x-auto rounded-[10px] border border-seam-strong bg-linen px-4 py-3.5 font-mono text-sm whitespace-pre-wrap">
        <code>{score.formula}</code>
      </pre>
      <ul
        aria-label={score.bandsLabel}
        className="mt-3 grid gap-2.5 sm:grid-cols-3"
      >
        {bands.map((band) => {
          const tone = TONE[band.tone];
          const Icon = tone.icon;
          return (
            <li
              key={band.tone}
              className="grid gap-0.5 rounded-[10px] border border-seam-strong bg-linen p-3.5"
            >
              <b className="text-2xl font-bold tabular-nums">{band.range}</b>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${tone.text}`}
              >
                <Icon size={15} strokeWidth={1.5} aria-hidden />
                {band.label}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
