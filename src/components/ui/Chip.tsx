import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
  swatch?: string;
  hatched?: boolean;
  tone?: "plain" | "test" | "fresh";
  className?: string;
};

const TONE = {
  plain: "border-seam-strong bg-linen text-ink",
  test: "border-[#d3bdf9] bg-[#f7f2ff] text-[#6a3ec2]",
  fresh: "border-[#b9d3b4] bg-[#f0f6ee] text-ok",
};

export function Chip({
  children,
  swatch,
  hatched,
  tone = "plain",
  className = "",
}: ChipProps) {
  return (
    <span
      className={`inline-flex h-[26px] items-center gap-1.5 rounded-full border pr-2.5 pl-2 text-[12.5px] font-semibold whitespace-nowrap ${TONE[tone]} ${className}`}
    >
      {hatched ? (
        <span className="hatch inline-block size-3 rounded-[2px]" aria-hidden />
      ) : swatch ? (
        <span
          className="inline-block size-3 rounded-[2px]"
          style={{ background: swatch }}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
