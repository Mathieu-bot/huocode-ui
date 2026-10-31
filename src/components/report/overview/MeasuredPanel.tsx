"use client";

import { ListTree, Ruler } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { overviewCopy } from "@/copy/overview";
import { useReportContext } from "../ReportContext";
import { icon, PanelTitle } from "./ScorePanel";

export function MeasuredPanel({
  over,
  within,
  tests,
  notAnalyzed,
}: {
  over: number;
  within: number;
  tests: number;
  notAnalyzed: number;
}) {
  const { goTab } = useReportContext();
  const m = overviewCopy.measured;
  const rows = [
    { text: m.over(over), swatch: "bg-slate-dark" },
    { text: m.within(within), swatch: "bg-slate" },
    { text: m.tests(tests), swatch: "bg-q-test" },
    { text: m.notAnalyzed(notAnalyzed), swatch: "hatch" },
  ];
  return (
    <section
      className="panel grid content-start gap-3 px-[22px] pt-5 pb-[18px]"
      aria-label={overviewCopy.measuredTitle}
    >
      <PanelTitle>
        <Ruler {...icon} />
        {overviewCopy.measuredTitle}
      </PanelTitle>
      <ul className="grid gap-3 text-[15px] text-ink-2">
        {rows.map((row) => (
          <li key={row.swatch} className="flex items-center gap-[7px]">
            <i
              className={`inline-block size-3 flex-none rounded-[2px] ${row.swatch}`}
            />
            {row.text}
          </li>
        ))}
      </ul>
      <Button
        variant="line"
        size="sm"
        className="justify-self-start"
        onClick={() => goTab("files")}
      >
        <ListTree {...icon} />
        {overviewCopy.browseAll}
      </Button>
    </section>
  );
}
