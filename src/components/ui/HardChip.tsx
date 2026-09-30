import type { ButtonHTMLAttributes } from "react";

type HardChipProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function HardChip({ className = "", ...rest }: HardChipProps) {
  return (
    <button
      className={`hard-sm hard-lift cursor-pointer bg-chip px-4 py-1 text-ink hover:bg-action ${className}`}
      {...rest}
    />
  );
}
