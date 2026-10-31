"use client";

import { SlidersHorizontal } from "lucide-react";
import { quadrantCopy } from "@/shared/copy/quadrants";
import { filtersCopy, SCOPE_LABEL } from "../../copy";
import { useReportContext } from "../../shell/ReportContext";

/** Tells the reader that Map and Files are filtered while this summary is not. */
export function FilterNotice() {
  const { scope, focus, clearFilters } = useReportContext();
  if (scope === "all" && !focus) return null;
  const parts = [
    scope !== "all" ? SCOPE_LABEL[scope] : null,
    focus ? quadrantCopy(focus).label : null,
  ].filter(Boolean);
  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[10px] border border-blush-line bg-blush px-4 py-3 text-sm text-ink"
    >
      <SlidersHorizontal
        size={16}
        strokeWidth={1.5}
        className="text-garnet"
        aria-hidden
      />
      <span>
        {filtersCopy.noticeLead}{" "}
        <b className="text-garnet-deep">{parts.join(" · ")}</b>.{" "}
        {filtersCopy.noticeTail}
      </span>
      <button
        type="button"
        onClick={clearFilters}
        className="ml-auto cursor-pointer font-semibold text-garnet underline decoration-blush-line underline-offset-4 hover:decoration-garnet"
      >
        {filtersCopy.clear}
      </button>
    </div>
  );
}
