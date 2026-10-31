"use client";

import {
  Check,
  DoorOpen,
  FileCheck2,
  Hourglass,
  Info,
  Scissors,
} from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { analyzeCopy, formatClock } from "@/copy/analyze";
import { useNow } from "@/hooks/useTicker";
import { SewingMap } from "./SewingMap";

const SLOW_AFTER_S = 45;

type Props = {
  repo: string;
  startedAt: number;
  estimatedSeconds: number | null;
  link: string;
};

export function JobProgress({
  repo,
  startedAt,
  estimatedSeconds,
  link,
}: Props) {
  const copy = analyzeCopy(repo);
  const now = useNow(true);
  const elapsed = Math.max(0, (now - startedAt) / 1000);
  const slow = elapsed > Math.max(SLOW_AFTER_S, (estimatedSeconds ?? 0) * 1.5);
  const rows = [
    { icon: Check, label: copy.trackReceived, at: "0:00", state: "done" },
    {
      icon: Scissors,
      label: copy.trackRunning,
      at: formatClock(elapsed),
      state: "now",
    },
    { icon: FileCheck2, label: copy.trackReady, at: "", state: "todo" },
  ] as const;

  return (
    <div className="grid gap-[18px] lg:grid-cols-[minmax(0,1fr)_310px]">
      <section className="panel p-6">
        <div
          className="text-[64px] leading-none font-bold tracking-[-0.03em] tabular-nums"
          role="timer"
          aria-live="off"
        >
          {formatClock(elapsed)}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-2">
          <Hourglass size={15} strokeWidth={1.5} aria-hidden />
          {copy.elapsed(estimatedSeconds)}
        </p>
        <ol className="mt-[22px]">
          {rows.map(({ icon: Icon, label, at, state }) => (
            <li
              key={label}
              className="grid grid-cols-[26px_1fr_auto] items-center gap-3 border-t border-dashed border-chalk-soft py-[11px] text-[15px]"
            >
              <span
                className={`grid size-[26px] place-items-center rounded-full border ${
                  state === "done"
                    ? "border-ink bg-ink text-white"
                    : state === "now"
                      ? "border-garnet bg-blush text-garnet"
                      : "border-seam-strong text-ink-3"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} aria-hidden />
              </span>
              <span className={state === "todo" ? "text-ink-2" : ""}>
                {label}
              </span>
              <span className="num text-[12.5px] text-ink-3">{at}</span>
            </li>
          ))}
        </ol>
        {slow && (
          <p
            className="mt-3 flex items-start gap-2 text-sm text-warn"
            role="status"
          >
            <Info size={15} strokeWidth={1.5} className="mt-0.5" aria-hidden />
            {copy.slow}
          </p>
        )}
        <SewingMap height={120} />
      </section>
      <aside className="panel grid content-start gap-3 p-5 text-[14.5px] text-ink-2">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <DoorOpen size={18} strokeWidth={1.5} aria-hidden />
          {copy.closeTitle}
        </h2>
        <p>{copy.closeBody}</p>
        <div className="flex gap-1.5">
          <code className="num flex-1 truncate rounded-lg border border-seam bg-toile px-2.5 py-2 text-[12.5px]">
            {link}
          </code>
          <CopyButton text={link} label={copy.copy} done={copy.copied} />
        </div>
        <p>{copy.titleHint}</p>
      </aside>
    </div>
  );
}
