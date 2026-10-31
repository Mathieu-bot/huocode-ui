import {
  ChartColumn,
  FileDiff,
  GitCommitHorizontal,
  Ruler,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { FileResult } from "@/api-client/api";
import { fmt } from "../copy";
import { linesChanged } from "../model";

const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;

function Metric({
  label,
  value,
  sub,
  iconNode,
  wide,
  children,
}: {
  label: string;
  value: string;
  sub?: string;
  iconNode: ReactNode;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`grid content-start gap-[3px] rounded-[10px] border border-seam bg-linen px-3.5 py-3 ${wide ? "col-span-full" : ""}`}
    >
      <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-2">
        {iconNode}
        {label}
      </dt>
      <dd className="num m-0 text-[19px] font-semibold">{value}</dd>
      {children}
      {sub && <span className="text-[12.5px] text-ink-2">{sub}</span>}
    </div>
  );
}

export function FileMetrics({ file }: { file: FileResult }) {
  const cc = file.complexity ?? 0;
  return (
    <dl className="m-0 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <Metric
        wide
        label="Most complex method"
        value={String(cc)}
        iconNode={<Ruler {...icon} />}
        sub={`${file.exceedsCommonComplexityThreshold ? "Over" : "Within"} the common limit of 10 (rose mark), on a 0–50 scale`}
      >
        <span
          className="relative mt-1.5 block h-2.5 rounded-[2px] border border-blush-line bg-blush"
          aria-hidden
        >
          <span
            className="absolute inset-y-0 left-0 rounded-[1px] bg-ink"
            style={{ width: `${Math.min(100, (cc / 50) * 100)}%` }}
          />
          <span className="absolute -inset-y-1.5 left-[20%] w-0.5 bg-garnet" />
        </span>
      </Metric>
      <Metric
        label="Lines changed"
        value={fmt(linesChanged(file))}
        iconNode={<FileDiff {...icon} />}
        sub={`+${fmt(file.churn?.linesAdded ?? 0)} · −${fmt(file.churn?.linesDeleted ?? 0)}`}
      />
      <Metric
        label="Commits"
        value={fmt(file.churn?.commits ?? 0)}
        iconNode={<GitCommitHorizontal {...icon} />}
        sub="in the period covered"
      />
      <Metric
        label="People"
        value={fmt(file.churn?.authors ?? 0)}
        iconNode={<Users {...icon} />}
        sub="who changed it"
      />
      <Metric
        label="Rank here"
        value={
          file.complexityPercentile !== undefined
            ? `${file.complexityPercentile} · ${file.churnPercentile ?? "—"}`
            : "—"
        }
        iconNode={<ChartColumn {...icon} />}
        sub={
          file.complexityPercentile !== undefined
            ? "complexity · change, out of 100"
            : "too few files to rank"
        }
      />
    </dl>
  );
}
