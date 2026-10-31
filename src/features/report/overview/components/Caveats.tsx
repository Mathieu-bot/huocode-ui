import { FilePen, Languages, ShieldAlert, TriangleAlert } from "lucide-react";
import type { AnalysisResult } from "@/api-client/api";
import { caveats, overviewCopy } from "../copy";
import { icon } from "./ScorePanel";

const ICON = {
  languages: Languages,
  comparison: TriangleAlert,
  renamed: FilePen,
};

export function Caveats({ report }: { report: AnalysisResult }) {
  const list = caveats(report);
  return (
    <>
      {list.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {list.map((caveat) => {
            const Icon = ICON[caveat.kind];
            return (
              <li
                key={caveat.kind}
                className="flex items-start gap-3 rounded-[10px] border border-seam-strong bg-linen px-4 py-3 text-sm"
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden
                  className={`mt-px shrink-0 ${caveat.tone === "warn" ? "text-warn" : "text-slate-dark"}`}
                />
                <span>
                  <b>{caveat.title}</b> {caveat.body}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-3.5 flex items-start gap-2.5 rounded-[10px] border border-dashed border-chalk px-4 py-3.5 text-[13.5px] text-ink-2">
        <ShieldAlert {...icon} className="mt-0.5 shrink-0" />
        <span>{overviewCopy.disclaimer}</span>
      </p>
    </>
  );
}
