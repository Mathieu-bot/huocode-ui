import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "rose" | "line";
type Size = "md" | "sm" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "border-ink bg-ink text-on-dark hover:bg-[#170d1b]",
  rose: "border-garnet bg-garnet text-on-dark hover:border-garnet-deep hover:bg-garnet-deep",
  line: "border-seam-strong bg-linen text-ink hover:border-ink",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-[18px] text-base",
  lg: "h-14 px-[26px] text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border font-semibold no-underline",
    "transition-[background-color,border-color,transform] duration-200 active:translate-y-px",
    "disabled:cursor-not-allowed disabled:border-seam disabled:bg-seam disabled:text-ink-2",
    VARIANT[variant],
    SIZE[size],
  ].join(" ");
}

type Common = { variant?: Variant; size?: Size };

export function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${buttonClass(variant, size)} ${className}`}
      {...rest}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  className = "",
  href,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={`${buttonClass(variant, size)} ${className}`}
      {...rest}
    />
  );
}
