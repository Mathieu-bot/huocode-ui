"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { AnalysisResult, Quadrant } from "@/api-client/api";
import { defaultSelection, reportStats } from "../model";
import { analyzePath, type RepoRef, reportPath } from "@/shared/lib/repo";
import { FilesTab } from "../files/FilesTab";
import { MapTab } from "../map/MapTab";
import { OverviewTab } from "../overview/OverviewTab";
import { ReportContext, type ReportTab } from "./ReportContext";
import { ReportHeader } from "./ReportHeader";
import { ReportTabs } from "./ReportTabs";

const TABS: ReportTab[] = ["overview", "map", "files"];

function readFileHash(): string | null {
  const match = /(?:^#|&)file=([^&]+)/.exec(window.location.hash);
  return match ? decodeURIComponent(match[1]) : null;
}

export function ReportScreen({
  refName,
  report,
}: {
  refName: RepoRef;
  report: AnalysisResult;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("tab");
  const tab: ReportTab = TABS.includes(raw as ReportTab)
    ? (raw as ReportTab)
    : "overview";
  const stats = useMemo(() => reportStats(report), [report]);
  const [selected, setSelected] = useState<string | null>(() =>
    defaultSelection(report),
  );
  const [focus, setFocus] = useState<Quadrant | null>(null);
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );

  useEffect(() => {
    const fromHash = readFileHash();
    if (fromHash && report.files.some((f) => f.path === fromHash)) {
      // Deep link (#file=path): open the shared selection once on load.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(fromHash);
    }
  }, [report]);

  const select = useCallback((path: string) => {
    setSelected(path);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#file=${encodeURIComponent(path)}`,
    );
  }, []);

  const goTab = useCallback(
    (next: ReportTab) => {
      const sentinel = document.querySelector<HTMLElement>(
        "[data-tab-sentinel]",
      );
      const topH =
        document.querySelector("header")?.getBoundingClientRect().height ?? 58;
      const query = next === "overview" ? "" : `?tab=${next}`;
      router.replace(
        `${window.location.pathname}${query}${window.location.hash}`,
        { scroll: false },
      );
      if (sentinel) {
        const y = sentinel.getBoundingClientRect().top;
        // Keep the tab bar where it is when it is already stuck under the header.
        if (y < topH)
          requestAnimationFrame(() =>
            window.scrollTo(0, y + window.scrollY - topH),
          );
      }
    },
    [router],
  );

  const value = useMemo(
    () => ({ report, stats, selected, select, focus, setFocus, goTab }),
    [report, stats, selected, select, focus, goTab],
  );

  return (
    <ReportContext.Provider value={value}>
      <ReportHeader
        report={report}
        shareUrl={`${origin}${reportPath(refName)}`}
        analyzeHref={analyzePath(refName)}
      />
      <ReportTabs tab={tab} onChange={goTab} fileCount={report.files.length} />
      <div
        key={tab}
        role="tabpanel"
        aria-labelledby={`report-tab-${tab}`}
        className="animate-[panel-in_.32s_cubic-bezier(.22,.9,.24,1)] pt-[22px] motion-reduce:animate-none"
      >
        {tab === "overview" && <OverviewTab />}
        {tab === "map" && <MapTab />}
        {tab === "files" && <FilesTab />}
      </div>
    </ReportContext.Provider>
  );
}
