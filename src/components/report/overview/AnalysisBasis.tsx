import {
  BookOpen,
  CalendarRange,
  GitCommitHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { AnalysisWindow } from "@/api-client/api";
import { overviewCopy, periodLabel } from "@/copy/overview";
import { fmt } from "@/copy/report";
import { icon } from "./ScorePanel";

const CELL =
  "grid content-start gap-1 px-5 py-[18px] border-dashed border-chalk-soft";
const LABEL = "flex items-center gap-[7px] text-[13.5px] text-ink-2";
const BIG_BASE = "leading-[1.1] font-semibold tracking-[-0.01em]";
const BIG = `${BIG_BASE} text-[32px]`;

const count = (value: number | undefined) =>
  Number.isFinite(value) ? fmt(value as number) : "—";

export function AnalysisBasis({ basis }: { basis?: AnalysisWindow }) {
  const period = periodLabel(basis?.oldestCommitDate, basis?.newestCommitDate);
  return (
    <div className="panel mt-11 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.5fr)]">
      <div className={CELL}>
        <span className={BIG}>{count(basis?.commitsAnalyzed)}</span>
        <span className={LABEL}>
          <GitCommitHorizontal {...icon} />
          {overviewCopy.commitsRead}
        </span>
      </div>
      <div className={`${CELL} max-sm:border-t sm:border-l`}>
        <span className={BIG}>{count(basis?.distinctAuthors)}</span>
        <span className={LABEL}>
          <Users {...icon} />
          {overviewCopy.people}
        </span>
      </div>
      <div className={`${CELL} max-sm:border-t sm:border-l`}>
        <span className={`${BIG_BASE} text-2xl`}>{period ?? "—"}</span>
        <span className={LABEL}>
          <CalendarRange {...icon} />
          {overviewCopy.period}
        </span>
      </div>
      <div
        className={`${CELL} border-t sm:col-span-3 xl:col-span-1 xl:border-t-0 xl:border-l`}
      >
        <span className="text-[14.5px]">{overviewCopy.windowOnly}</span>
        <Link
          href="/how-it-works"
          className={`${LABEL} text-ink underline decoration-chalk`}
        >
          <BookOpen {...icon} />
          {overviewCopy.howComputed}
        </Link>
      </div>
    </div>
  );
}
