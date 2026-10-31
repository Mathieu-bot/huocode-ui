"use client";

import { LayoutDashboard, ListTree, Map as MapIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GlideGroup } from "@/components/ui/GlideGroup";
import { reportCopy } from "@/copy/report";
import type { ReportTab } from "./ReportContext";

const icon = { size: 18, strokeWidth: 1.5, "aria-hidden": true } as const;

/** Sticks under the site header; gains a full-bleed background once stuck so content never shows through. */
export function ReportTabs({
  tab,
  onChange,
  fileCount,
}: {
  tab: ReportTab;
  onChange: (tab: ReportTab) => void;
  fileCount: number;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) =>
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 100),
      {
        rootMargin: "-58px 0px 0px 0px",
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} data-tab-sentinel className="h-px" aria-hidden />
      <div className="sticky top-[var(--top-h)] z-40 mt-[21px]">
        <div
          aria-hidden
          className={`absolute inset-y-0 right-[calc(50%-50vw)] left-[calc(50%-50vw)] -z-10 border-b border-seam-strong bg-toile/[0.97] shadow-[0_10px_24px_-18px_rgb(43_27_48/0.5)] backdrop-blur-md transition-opacity duration-300 ${stuck ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`border-b border-dashed transition-colors ${stuck ? "border-transparent" : "border-chalk"}`}
        >
          <GlideGroup<ReportTab>
            variant="bar"
            label={reportCopy.tabsLabel}
            idPrefix="report-tab"
            value={tab}
            onChange={onChange}
            items={[
              {
                key: "overview",
                label: reportCopy.tabs.overview,
                icon: <LayoutDashboard {...icon} />,
              },
              {
                key: "map",
                label: reportCopy.tabs.map,
                icon: <MapIcon {...icon} />,
              },
              {
                key: "files",
                label: reportCopy.tabs.files,
                icon: <ListTree {...icon} />,
                badge: (
                  <span className="num rounded-full border border-seam bg-toile px-[7px] text-xs font-medium">
                    {fileCount}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
