import {
  CircleCheck,
  Github,
  GitCommitHorizontal,
  Calendar,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { AnalysisResult } from "@/api-client/api";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CopyButton } from "@/components/ui/CopyButton";
import { reportCopy } from "@/copy/report";
import { toDate } from "@/lib/report";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function ReportHeader({
  report,
  shareUrl,
  analyzeHref,
}: {
  report: AnalysisResult;
  shareUrl: string;
  analyzeHref: string;
}) {
  const [owner, name] = report.repo.split("/");
  const icon = { size: 15, strokeWidth: 1.5, "aria-hidden": true } as const;
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pt-[30px]">
      <div>
        <h1 className="text-[clamp(30px,3.6vw,42px)] leading-[1.05] font-bold tracking-[-0.02em]">
          <span className="font-normal text-ink-3">{owner} /</span> {name}
        </h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-[18px] gap-y-1.5 text-[13.5px] text-ink-2">
          <Chip tone="fresh">
            <CircleCheck {...icon} />
            {reportCopy.upToDate}
          </Chip>
          <a
            href={`https://github.com/${report.repo}/commit/${report.commitSha}`}
            className="inline-flex items-center gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitCommitHorizontal {...icon} />
            <span className="num text-[13px]">
              {report.commitSha.slice(0, 7)}
            </span>
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Calendar {...icon} />
            {reportCopy.mapped(dateFormat.format(toDate(report.analyzedAt)))}
          </span>
          <a
            href={`https://github.com/${report.repo}`}
            className="inline-flex items-center gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github {...icon} />
            {reportCopy.viewOnGithub}
          </a>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <CopyButton
          text={shareUrl}
          label={reportCopy.copyLink}
          done={reportCopy.copied}
        />
        <ButtonLink href={analyzeHref} variant="line" size="sm">
          <RefreshCw {...icon} />
          {reportCopy.mapAgain}
        </ButtonLink>
        <ButtonLink href="/" size="sm">
          <Plus {...icon} />
          {reportCopy.another}
        </ButtonLink>
      </div>
    </div>
  );
}
