"use client";

import { createContext, useContext } from "react";
import type { AnalysisResult, Quadrant } from "@/api-client/api";
import type { ReportStats } from "@/lib/report";

export type ReportTab = "overview" | "map" | "files";

export type ReportContextValue = {
  report: AnalysisResult;
  stats: ReportStats;
  /** Path of the file shown in the detail panel (Map and Files share it). */
  selected: string | null;
  select: (path: string) => void;
  /** Quadrant the Overview matrix asked to focus on, or null for every file. */
  focus: Quadrant | null;
  setFocus: (quadrant: Quadrant | null) => void;
  goTab: (tab: ReportTab) => void;
};

export const ReportContext = createContext<ReportContextValue | null>(null);

export function useReportContext(): ReportContextValue {
  const value = useContext(ReportContext);
  if (!value)
    throw new Error("useReportContext must be used inside <ReportScreen>.");
  return value;
}
