import type { InputHTMLAttributes } from "react";

type HardInputProps = InputHTMLAttributes<HTMLInputElement>;

export function HardInput({ className = "", ...rest }: HardInputProps) {
  return (
    <input
      className={`hard-sm w-full bg-field px-5 py-3 text-lg font-medium text-ink placeholder:text-secondary ${className}`}
      {...rest}
    />
  );
}
