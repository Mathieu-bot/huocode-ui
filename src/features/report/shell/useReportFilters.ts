"use client";

import { useCallback, useState } from "react";
import type { AnalysisResult, Quadrant } from "@/api-client/api";
import {
  byRisk,
  type FileScope,
  matchesView,
  type ViewFilter,
  worstIn,
} from "../model";

/**
 * The report-wide filter (file scope + quadrant focus) and the selection rules
 * that keep it consistent with the selected file.
 */
export function useReportFilters(
  report: AnalysisResult,
  selected: string | null,
  showFile: (path: string) => void,
) {
  const [focus, setFocusState] = useState<Quadrant | null>(null);
  const [scope, setScopeState] = useState<FileScope>("all");

  // Selection and filters stay consistent: picking a file the filters hide
  // clears them, and a new filter opens its worst matching file.
  const fileAt = useCallback(
    (path: string | null) => report.files.find((f) => f.path === path),
    [report],
  );

  const reveal = useCallback(
    (view: ViewFilter) => {
      if (matchesView(fileAt(selected), view)) return;
      const first =
        view.focus !== null
          ? worstIn(report, view.focus)
          : [...report.files].sort(byRisk).find((f) => matchesView(f, view));
      if (first) showFile(first.path);
    },
    [report, selected, fileAt, showFile],
  );

  const select = useCallback(
    (path: string) => {
      if (!matchesView(fileAt(path), { scope, focus })) {
        setScopeState("all");
        setFocusState(null);
      }
      showFile(path);
    },
    [scope, focus, fileAt, showFile],
  );

  const setFocus = useCallback(
    (quadrant: Quadrant | null) => {
      // A group only holds production files, so it replaces any other slice.
      const next: FileScope = quadrant ? "all" : scope;
      setFocusState(quadrant);
      setScopeState(next);
      if (quadrant) {
        const first = worstIn(report, quadrant);
        if (first) showFile(first.path);
      }
    },
    [report, scope, showFile],
  );

  const setScope = useCallback(
    (next: FileScope) => {
      const keepFocus = next === "all" || next === "prod" ? focus : null;
      setScopeState(next);
      setFocusState(keepFocus);
      reveal({ scope: next, focus: keepFocus });
    },
    [focus, reveal],
  );

  const clearFilters = useCallback(() => {
    setScopeState("all");
    setFocusState(null);
  }, []);

  return { scope, focus, select, setFocus, setScope, clearFilters };
}
