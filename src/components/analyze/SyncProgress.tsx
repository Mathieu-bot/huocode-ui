"use client";

import { Check, Clock, Download, History, Ruler } from "lucide-react";
import { analyzeCopy } from "@/copy/analyze";
import { useNow } from "@/hooks/useTicker";
import { SewingMap } from "./SewingMap";

const ICONS = [Download, History, Ruler];
const STEP_MS = 1100;

/**
 * The quick path reports no progress, so the three steps advance on a timer
 * and the last one stays open until the result arrives. Never a percentage.
 */
export function SyncProgress({
  repo,
  startedAt,
}: {
  repo: string;
  startedAt: number;
}) {
  const copy = analyzeCopy(repo);
  const now = useNow(true, 250);
  const current = Math.min(
    copy.steps.length - 1,
    Math.floor((now - startedAt) / STEP_MS),
  );

  return (
    <div>
      <ol className="grid gap-2" aria-live="polite">
        {copy.steps.map((label, index) => {
          const Icon = index < current ? Check : ICONS[index];
          const state =
            index < current ? "done" : index === current ? "now" : "todo";
          return (
            <li
              key={label}
              className={`flex items-center gap-3.5 rounded-[10px] border bg-linen px-[18px] py-3.5 transition-colors duration-300 ${
                state === "now"
                  ? "border-ink text-ink"
                  : "border-seam text-ink-2"
              }`}
            >
              <span
                className={`grid size-[30px] shrink-0 place-items-center rounded-full border ${
                  state === "done"
                    ? "border-ink bg-ink text-white"
                    : state === "now"
                      ? "border-garnet bg-blush text-garnet"
                      : "border-seam-strong text-ink-3"
                }`}
              >
                <Icon size={15} strokeWidth={1.5} aria-hidden />
              </span>
              {label}
              <span className="ml-auto text-[13px] text-ink-3">
                {state === "done"
                  ? copy.stepDone
                  : state === "now"
                    ? copy.stepNow
                    : ""}
              </span>
            </li>
          );
        })}
      </ol>
      <SewingMap />
      <p className="mt-3.5 flex items-center gap-2 text-[13.5px] text-ink-2">
        <Clock size={15} strokeWidth={1.5} aria-hidden />
        {copy.syncFoot}
      </p>
    </div>
  );
}
