"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { quadrantCopy } from "@/shared/copy/quadrants";
import { filtersCopy, SCOPE_LABEL } from "../copy";
import { quadrantCounts, scopeCounts } from "../model";
import { FilterPanel } from "./FilterPanel";
import { useReportContext } from "./ReportContext";

function ActiveChip({
  label,
  swatch,
  onRemove,
}: {
  label: string;
  swatch?: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-blush-line bg-blush pr-1 pl-3 text-[13px] font-semibold text-garnet-deep">
      {swatch && (
        <span
          className="inline-block size-2.5 rounded-[2px]"
          style={{ background: swatch }}
          aria-hidden
        />
      )}
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={filtersCopy.remove(label)}
        className="grid size-6 cursor-pointer place-items-center rounded-full hover:bg-blush-line"
      >
        <X size={13} strokeWidth={1.75} aria-hidden />
      </button>
    </span>
  );
}

/** Report-wide filters, visible on every tab from the sticky tab bar. */
export function ReportFilters() {
  const { report, scope, setScope, focus, setFocus, clearFilters } =
    useReportContext();
  const [open, setOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const counts = useMemo(() => scopeCounts(report.files), [report]);
  const groups = useMemo(
    () => (report.relativeScoringEnabled ? quadrantCounts(report.files) : null),
    [report],
  );
  const active = (scope !== "all" ? 1 : 0) + (focus ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!host.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={host}
      className="relative flex shrink-0 items-center gap-2 py-1.5"
    >
      <div className="hidden items-center gap-1.5 md:flex" aria-live="polite">
        {scope !== "all" && (
          <ActiveChip
            label={SCOPE_LABEL[scope]}
            onRemove={() => setScope("all")}
          />
        )}
        {focus && (
          <ActiveChip
            label={quadrantCopy(focus).label}
            swatch={quadrantCopy(focus).color}
            onRemove={() => setFocus(null)}
          />
        )}
      </div>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
          open || active
            ? "border-ink bg-ink text-on-dark"
            : "border-seam-strong bg-linen text-ink hover:border-ink"
        }`}
      >
        <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden />
        <span className="hidden sm:inline">{filtersCopy.button}</span>
        {active > 0 && (
          <span className="num grid size-5 place-items-center rounded-full bg-garnet text-xs text-on-dark">
            {active}
          </span>
        )}
      </button>
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={filtersCopy.panelLabel}
          className="panel absolute top-full right-0 z-50 mt-2 w-[min(92vw,400px)] p-4 shadow-[0_18px_40px_-20px_rgb(43_27_48/0.55)]"
        >
          <FilterPanel
            scope={scope}
            focus={focus}
            scopeCounts={counts}
            groupCounts={groups}
            onScope={setScope}
            onFocus={setFocus}
            onClear={clearFilters}
          />
        </div>
      )}
    </div>
  );
}
