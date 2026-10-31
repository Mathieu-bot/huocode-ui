"use client";

import { type MouseEvent, type FocusEvent, useState } from "react";
import type { FileResult } from "@/api-client/api";
import type { TipState } from "./MapTooltip";

/** Tooltip state for the map host: follows the mouse, or sits by the focused cell. */
export function useTip(byPath: Map<string, FileResult>) {
  const [tip, setTip] = useState<TipState | null>(null);

  const fileOf = (target: EventTarget) => {
    const el = (target as Element).closest?.("[data-path]");
    const path = el?.getAttribute("data-path");
    return path ? (byPath.get(path) ?? null) : null;
  };

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    const file = fileOf(event.target);
    if (!file) return setTip(null);
    const box = event.currentTarget.getBoundingClientRect();
    setTip({ file, x: event.clientX - box.left, y: event.clientY - box.top });
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const file = fileOf(event.target);
    if (!file) return setTip(null);
    const host = event.currentTarget.getBoundingClientRect();
    const cell = (event.target as Element).getBoundingClientRect();
    setTip({
      file,
      x: cell.left - host.left + cell.width / 2,
      y: cell.top - host.top + cell.height / 2,
    });
  };

  const hide = () => setTip(null);

  return { tip, onMouseMove, onFocus, onMouseLeave: hide, onBlur: hide };
}
