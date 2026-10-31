"use client";

import { useMemo } from "react";
import { AnalysisBasis } from "./components/AnalysisBasis";
import { Caveats } from "./components/Caveats";
import { MeasuredPanel } from "./components/MeasuredPanel";
import { NoScorePanel } from "./components/NoScorePanel";
import { QuadrantMatrix } from "./components/QuadrantMatrix";
import { ScorePanel } from "./components/ScorePanel";
import { StartHere } from "./components/StartHere";
import { useReportContext } from "../shell/ReportContext";

export function OverviewTab() {
  const { report, stats } = useReportContext();
  const score = report.repoHealthScore;
  const scored =
    report.relativeScoringEnabled &&
    typeof score === "number" &&
    Number.isFinite(score);
  const over = stats.production.filter(
    (f) => f.exceedsCommonComplexityThreshold,
  ).length;
  const top = useMemo(() => {
    const byPath = new Map(report.files.map((f) => [f.path, f]));
    return (report.top5 ?? []).flatMap((p) => byPath.get(p) ?? []);
  }, [report]);
  const otherLanguages = report.summary?.unanalyzed ?? stats.unsupported.length;

  return (
    <>
      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {scored ? (
          <ScorePanel
            score={score}
            hotspots={report.summary?.hotspot ?? 0}
            production={stats.production.length}
          />
        ) : (
          <NoScorePanel
            javaFiles={
              stats.production.length + stats.tests.length + stats.errors.length
            }
            over={over}
          />
        )}
        {scored ? (
          <QuadrantMatrix
            summary={report.summary ?? {}}
            tests={stats.tests.length}
            otherLanguages={otherLanguages}
          />
        ) : (
          <MeasuredPanel
            over={over}
            within={stats.production.length - over}
            tests={stats.tests.length}
            notAnalyzed={stats.unsupported.length + stats.errors.length}
          />
        )}
      </div>
      {scored && <StartHere files={top} />}
      <AnalysisBasis basis={report.analysisWindow} />
      <Caveats report={report} />
    </>
  );
}
