import type { ButtonHTMLAttributes } from "react";

type HardButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function HardButton({ className = "", ...rest }: HardButtonProps) {
  return (
    <button
      className={`hard hard-lift shrink-0 cursor-pointer bg-action px-6 py-3 text-lg font-medium tracking-wide text-ink disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    />
  );
}
