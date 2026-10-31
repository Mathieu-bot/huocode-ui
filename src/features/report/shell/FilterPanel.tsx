"use client";

import { RotateCcw } from "lucide-react";
import type { Quadrant } from "@/api-client/api";
import { QUADRANT_ORDER, quadrantCopy } from "@/shared/copy/quadrants";
import { filtersCopy, SCOPE_LABEL } from "../copy";
import { FILE_SCOPES, type FileScope } from "../model";

type Option = {
  id: string;
  label: string;
  count: number;
  on: boolean;
  swatch?: string;
  onPick: () => void;
};

function Choice({ label, count, on, swatch, onPick }: Option) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      disabled={count === 0 && !on}
      onClick={onPick}
      className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition-colors disabled:cursor-default disabled:opacity-45 ${
        on
          ? "border-ink bg-ink text-on-dark"
          : "border-seam-strong bg-linen text-ink hover:border-ink"
      }`}
    >
      {swatch && (
        <span
          className="pinked inline-block h-3.5 w-3 rounded-[1px] [--z:3px]"
          style={{ background: swatch }}
          aria-hidden
        />
      )}
      {label}
      <span
        className={`num font-medium ${on ? "text-[#d9c9d2]" : "text-ink-3"}`}
      >
        {count}
      </span>
    </button>
  );
}

function Group({ title, options }: { title: string; options: Option[] }) {
  return (
    <div role="radiogroup" aria-label={title} className="grid gap-2">
      <h3 className="text-xs font-semibold tracking-[0.06em] text-ink-2 uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Choice key={o.id} {...o} />
        ))}
      </div>
    </div>
  );
}

type Props = {
  scope: FileScope;
  focus: Quadrant | null;
  scopeCounts: Record<FileScope, number>;
  groupCounts: Record<Quadrant, number> | null;
  onScope: (scope: FileScope) => void;
  onFocus: (quadrant: Quadrant | null) => void;
  onClear: () => void;
};

/** Popover content: one slice of files, optionally narrowed to one group. */
export function FilterPanel({
  scope,
  focus,
  scopeCounts,
  groupCounts,
  onScope,
  onFocus,
  onClear,
}: Props) {
  const scopes: Option[] = FILE_SCOPES.map((key) => ({
    id: key,
    label: SCOPE_LABEL[key],
    count: scopeCounts[key],
    on: scope === key && (focus === null || key === "all"),
    onPick: () => onScope(key),
  }));
  const groups: Option[] | null = groupCounts && [
    {
      id: "any",
      label: filtersCopy.anyGroup,
      count: scopeCounts.prod,
      on: focus === null,
      onPick: () => onFocus(null),
    },
    ...QUADRANT_ORDER.map((q) => ({
      id: q,
      label: quadrantCopy(q).label,
      count: groupCounts[q],
      on: focus === q,
      swatch: quadrantCopy(q).color,
      onPick: () => onFocus(q),
    })),
  ];

  return (
    <div className="grid gap-4">
      <Group title={filtersCopy.show} options={scopes} />
      {groups && <Group title={filtersCopy.group} options={groups} />}
      <p className="text-[13px] text-ink-2">{filtersCopy.applies}</p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex cursor-pointer items-center gap-1.5 justify-self-start text-sm font-semibold text-garnet underline decoration-blush-line underline-offset-4 hover:decoration-garnet"
      >
        <RotateCcw size={14} strokeWidth={1.5} aria-hidden />
        {filtersCopy.clear}
      </button>
    </div>
  );
}
