"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

export type GlideItem<K extends string> = {
  key: K;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
};

type Props<K extends string> = {
  items: GlideItem<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  /** "bar": underlined tabs (role tablist). "pill": segmented control (role group). */
  variant?: "bar" | "pill";
  idPrefix?: string;
};

/** Tabs or a segmented control whose active marker slides to the new choice. */
export function GlideGroup<K extends string>({
  items,
  value,
  onChange,
  label,
  variant = "pill",
  idPrefix,
}: Props<K>) {
  const host = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{
    x: number;
    w: number;
    animate: boolean;
  } | null>(null);
  const bar = variant === "bar";

  useLayoutEffect(() => {
    const measure = (animate: boolean) => {
      const el = host.current?.querySelector<HTMLElement>(
        `[data-key="${value}"]`,
      );
      if (el)
        setBox((prev) => ({
          x: el.offsetLeft,
          w: el.offsetWidth,
          animate: animate && prev !== null,
        }));
    };
    measure(true);
    const observer = new ResizeObserver(() => measure(false));
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, [value]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const i = items.findIndex((item) => item.key === value);
    const next =
      items[
        (i + (event.key === "ArrowRight" ? 1 : items.length - 1)) % items.length
      ];
    onChange(next.key);
    host.current
      ?.querySelector<HTMLElement>(`[data-key="${next.key}"]`)
      ?.focus();
  }

  return (
    <div
      ref={host}
      role={bar ? "tablist" : "group"}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={
        bar
          ? "relative flex [scrollbar-width:none] gap-1 overflow-x-auto"
          : "relative inline-flex rounded-full border border-seam-strong bg-toile p-[3px]"
      }
    >
      {box && (
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 ${bar ? "bottom-0 h-0.5 rounded-sm bg-garnet" : "top-[3px] bottom-[3px] rounded-full bg-ink"} ${box.animate ? "transition-[transform,width] duration-[400ms] ease-[cubic-bezier(.22,.9,.24,1)] motion-reduce:transition-none" : ""}`}
          style={{
            width: bar ? box.w - 24 : box.w,
            transform: `translateX(${bar ? box.x + 12 : box.x}px)`,
          }}
        />
      )}
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            data-key={item.key}
            id={idPrefix ? `${idPrefix}-${item.key}` : undefined}
            role={bar ? "tab" : undefined}
            aria-selected={bar ? active : undefined}
            aria-pressed={bar ? undefined : active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.key)}
            className={
              bar
                ? `relative z-[1] inline-flex cursor-pointer items-center gap-2 px-4 pt-3 pb-[13px] text-[15px] font-semibold whitespace-nowrap transition-colors ${active ? "text-ink [&_svg]:text-garnet" : "text-ink-2 hover:text-ink"}`
                : `relative z-[1] inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-300 ${active ? "text-on-dark" : "text-ink-2 hover:text-ink"}`
            }
          >
            {item.icon}
            {item.label}
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}
