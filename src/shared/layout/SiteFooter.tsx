import { EyeOff, Infinity as InfinityIcon } from "lucide-react";
import { siteCopy } from "@/shared/layout/copy";

export function SiteFooter() {
  const copy = siteCopy();
  return (
    <footer className="mt-auto border-t border-dashed border-chalk pt-[22px] pb-11 text-[13.5px] text-ink-2">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap justify-between gap-x-7 gap-y-2 px-4 sm:px-6">
        <span className="inline-flex items-center gap-2">
          <EyeOff size={15} strokeWidth={1.5} aria-hidden />
          {copy.footerStatic}
        </span>
        <span className="inline-flex items-center gap-2">
          <InfinityIcon size={15} strokeWidth={1.5} aria-hidden />
          {copy.footerReports}
        </span>
      </div>
    </footer>
  );
}
